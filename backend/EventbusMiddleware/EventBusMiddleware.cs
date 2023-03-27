using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RealtimeGame.Payloads;
using StackExchange.Redis;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Numerics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace RealtimeGame.EventbusMiddleware
{
    public class EventBusMiddleware : BaseEventBusMiddleware
    {
        public EventBusMiddleware(RequestDelegate next) : base (next)
        {
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
            {
                await _next.Invoke(context);
                return;
            }

            CancellationToken ct = context.RequestAborted;
            WebSocket currentSocket = await context.WebSockets.AcceptWebSocketAsync();

            var pubSubSubscription = redisMemoryCache.Subscribe(
                AppConstants.GAME_EVENT_BUS,
                async (channel, message) => {
                    if (!string.IsNullOrWhiteSpace(message) && message.HasValue)
                    {
                        await SendNewMessages(message, currentSocket, context, ct);
                    }
                }
            );

            var receiveTask = Task.Run(
               async () => {
                   while (true)
                   {
                       if (ct.IsCancellationRequested)
                       {
                           break;
                       }

                       var response = await ReceiveStringAsync(currentSocket, ct);
                       if (string.IsNullOrEmpty(response))
                       {
                           if (currentSocket.State != WebSocketState.Open)
                           {
                               break;
                           }

                           continue;
                       }
                       else
                       {
                           await SaveMessage(response, context);
                       }
                       Thread.Sleep(100);
                   }
                   return "done";
               }
            );

            var userListingTask = Task.Run(
               async () => {
                   while (true)
                   {
                       if (ct.IsCancellationRequested)
                       {
                           break;
                       }
                       var userListString = await redisMemoryCache.GetAllItemsInList(AppConstants.GAME_TEAM_NAME);
                       if (userListString != null)
                       {
                           var userList = userListString.Select(x => JsonConvert.DeserializeObject<AppPlayerBasic>(x)).ToList();

                           var playersToSend = new List<AppPlayer>();

                           foreach (var player in userList)
                           {
                               if (player != null)
                               {
                                   var lastKnown = await redisMemoryCache.GetValueFromKey(AppConstants.GAME_LAST_KNOWN, player.id);
                                   if (lastKnown != null)
                                   {
                                       var lastKnownList = JsonConvert.DeserializeObject<double[]>(lastKnown);
                                       if (lastKnownList != null)
                                       {
                                           if (lastKnownList[2] < DateTimeOffset.Now.ToUnixTimeSeconds() - 5)
                                           {
                                               await redisMemoryCache.DeleteValueWithKey(AppConstants.GAME_LAST_KNOWN, player.id);
                                               await redisMemoryCache.RemoveItemFromList(AppConstants.GAME_TEAM_NAME, JsonConvert.SerializeObject(player));
                                           }
                                           else
                                           {
                                               playersToSend.Add(new AppPlayer()
                                               {
                                                   id = player.id,
                                                   name = player.name,
                                                   avatarUrl = player.avatarUrl,
                                                   posX = lastKnownList![0],
                                                   posY = lastKnownList![1]
                                               });
                                           }
                                       }
                                   }
                               }
                           }
                           await SendNewMessages(JsonConvert.SerializeObject(new EventBusMessage<List<AppPlayer>>()
                           {
                               Payload = playersToSend,
                               Type = EventBusMessageTypes.UserList
                           }), currentSocket, context, ct);
                       }
                       Thread.Sleep(2000);
                   }
                   return "done";
               }
            );

            while (true)
            {
                if (ct.IsCancellationRequested)
                {
                    break;
                }
                Thread.Sleep(500);
            }

            try
            {
                if (pubSubSubscription != null)
                {
                    pubSubSubscription.CloseAndUnsubscribe();
                }
                await currentSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", ct);
                currentSocket.Dispose();
            }
            catch (Exception)
            {

            }
        }

        private async Task SaveMessage(string message, HttpContext context)
        {
            if (message == "echo")
            {
                return;
            }

            try
            {
                var eventMessage = JsonConvert.DeserializeObject<EventBusMessageBase>(message);
                if (eventMessage != null)
                {
                    switch (eventMessage.Type)
                    {
                        case EventBusMessageTypes.UserMovement:
                            var fullUserMovement = JsonConvert.DeserializeObject<EventBusMessage<AppPlayerWithPositionOnly>>(message);
                            if (fullUserMovement != null)
                            {
                                await redisMemoryCache.SetValueWithKey(
                                    AppConstants.GAME_LAST_KNOWN,
                                    fullUserMovement.Payload.id,
                                    JsonConvert.SerializeObject(new double[] { fullUserMovement.Payload.posX, fullUserMovement.Payload.posY, DateTimeOffset.Now.ToUnixTimeSeconds() })
                                );

                                redisMemoryCache.Publish(AppConstants.GAME_EVENT_BUS, JsonConvert.SerializeObject(fullUserMovement));
                            }
                            break;
                        case EventBusMessageTypes.UserJoined:
                            var fullUserJoined = JsonConvert.DeserializeObject<EventBusMessage<AppPlayer>>(message);
                            if (fullUserJoined != null)
                            {
                                await redisMemoryCache.SetValueWithKey(
                                    AppConstants.GAME_LAST_KNOWN,
                                    fullUserJoined.Payload.id,
                                    JsonConvert.SerializeObject(new double[] { fullUserJoined.Payload.posX, fullUserJoined.Payload.posY, DateTimeOffset.Now.ToUnixTimeSeconds() })
                                );

                                await redisMemoryCache.AddItemToList(AppConstants.GAME_TEAM_NAME, JsonConvert.SerializeObject(new AppPlayerBasic()
                                {
                                    id = fullUserJoined.Payload.id,
                                    avatarUrl = fullUserJoined.Payload.avatarUrl,
                                    name = fullUserJoined.Payload.name
                                }));
                            }
                            break;
                        case EventBusMessageTypes.UserLeft:
                            var fullUserLeft = JsonConvert.DeserializeObject<EventBusMessage<AppPlayerBasic>>(message);
                            if (fullUserLeft != null)
                            {
                                await redisMemoryCache.RemoveItemFromList(AppConstants.GAME_TEAM_NAME, JsonConvert.SerializeObject(fullUserLeft.Payload));
                            }
                            break;
                        case EventBusMessageTypes.EchoPresence:
                            var playerPresence = JsonConvert.DeserializeObject<EventBusMessage<AppPlayerPresence>>(message);
                            if (playerPresence != null)
                            {
                                var lastKnown = await redisMemoryCache.GetValueFromKey(AppConstants.GAME_LAST_KNOWN, playerPresence.Payload.id!);
                                var lastKnownList = JsonConvert.DeserializeObject<double[]>(lastKnown!);

                                await redisMemoryCache.SetValueWithKey(
                                    AppConstants.GAME_LAST_KNOWN,
                                    playerPresence.Payload.id,
                                    JsonConvert.SerializeObject(new double[] { lastKnownList![0], lastKnownList![1], DateTimeOffset.Now.ToUnixTimeSeconds() })
                                );
                            }
                            break;
                    }
                }
            }
            catch (Exception)
            {

            }
        }

        private async Task SendNewMessages(string nextItem, WebSocket socket, HttpContext context, CancellationToken ct = default)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(nextItem))
                {
                    var eventMessage = JsonConvert.DeserializeObject<EventBusMessageBase>(nextItem);
                    if (eventMessage != null)
                    {
                        switch (eventMessage.Type)
                        {
                            case EventBusMessageTypes.UserList:
                            case EventBusMessageTypes.UserMovement:
                                await SendStringAsync(socket, nextItem, ct);
                                break;
                        }
                    }
                }
            }
            catch (Exception)
            {

            }
        }
    }
}
