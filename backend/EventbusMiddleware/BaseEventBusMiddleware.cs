﻿using System.Net.WebSockets;
using System.Text;

namespace RealtimeGame.EventbusMiddleware
{
	public class BaseEventBusMiddleware
    {
        internal readonly RequestDelegate _next;
        internal GameRedisSessionState redisMemoryCache;

        public BaseEventBusMiddleware(RequestDelegate next)
        {
            _next = next;

            var redisHost = Environment.GetEnvironmentVariable("REDIS_HOST");
            var redisPort = Environment.GetEnvironmentVariable("REDIS_PORT");
            var redisPassword = Environment.GetEnvironmentVariable("REDIS_PASSWORD");

            File.WriteAllText("config.log", $"Config is: REDIS_HOST={redisHost}, REDIS_PORT={redisPort}");

            redisMemoryCache = new GameRedisSessionState(redisHost, redisPort, redisPassword);
        }

        internal static Task SendStringAsync(WebSocket socket, string data, CancellationToken ct = default)
        {
            var buffer = Encoding.UTF8.GetBytes(data);
            var segment = new ArraySegment<byte>(buffer);

            return socket.SendAsync(segment, WebSocketMessageType.Text, true, ct);
        }

        internal static async Task<string?> ReceiveStringAsync(WebSocket socket, CancellationToken ct = default)
        {
            var buffer = new ArraySegment<byte>(new byte[8192]);
            using (var ms = new MemoryStream())
            {
                WebSocketReceiveResult result;
                do
                {
                    ct.ThrowIfCancellationRequested();

                    result = await socket.ReceiveAsync(buffer, ct);
                    ms.Write(buffer.Array != null ? buffer.Array : new byte[0], buffer.Offset, result.Count);
                }
                while (!result.EndOfMessage);

                ms.Seek(0, SeekOrigin.Begin);
                if (result.MessageType != WebSocketMessageType.Text)
                {
                    return null;
                }

                using (var reader = new StreamReader(ms, Encoding.UTF8))
                {
                    return await reader.ReadToEndAsync();
                }
            }
        }
    }
}

