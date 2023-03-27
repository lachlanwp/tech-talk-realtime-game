using StackExchange.Redis;
using System;
using System.Threading.Tasks;

namespace RealtimeGame
{
    public class GameRedisSubscription
    {
        public ConnectionMultiplexer? RedisConnection;
        public ISubscriber? Subscription;

        public void CloseAndUnsubscribe()
        {
            try
            {
                if (Subscription != null)
                {
                    Subscription.UnsubscribeAll();
                }
                if (RedisConnection != null)
                {
                    RedisConnection.Dispose();
                }
            }
            catch (Exception)
            {

            }
        }
    }
    public class GameRedisSessionState
    {
        private int KeyExpiryHours = 12;
        private ConnectionMultiplexer? redis;
        private ConfigurationOptions? config;

        public GameRedisSessionState(string host, string port, string password)
        {
            config =
            new ConfigurationOptions
            {
                EndPoints = { $"{host}:{port}" },
                Password = password,
            };
        }

        public GameRedisSubscription? Subscribe(string channelName, Action<RedisChannel, RedisValue> onMessageReceived)
        {
            try
            {
                if (config != null)
                {
                    redis = ConnectionMultiplexer.Connect(config);
                    var subscriber = redis.GetSubscriber();
                    subscriber.Subscribe(channelName, onMessageReceived);
                    return new GameRedisSubscription()
                    {
                        RedisConnection = redis,
                        Subscription = subscriber
                    };
                }
                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public void Publish(string channelName, string message)
        {
            try
            {
                if (config != null)
                {
                    using (redis = ConnectionMultiplexer.Connect(config))
                    {
                        var subscriber = redis.GetSubscriber();
                        subscriber.Publish(channelName, message);
                    }
                }
            }
            catch (Exception)
            {

            }
        }

        public async Task<string?> GetValueFromKey(string userId, string key)
        {
            try
            {
                string? result = null;

                if (config != null)
                {
                    using (redis = ConnectionMultiplexer.Connect(config))
                    {
                        var db = redis.GetDatabase();
                        result = await db.HashGetAsync(userId, key);
                    }
                }
                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool?> SetValueWithKey(string userId, string key, string value)
        {
            try
            {
                bool? result;
                if (config != null)
                {
                    using (redis = ConnectionMultiplexer.Connect(config))
                    {
                        var db = redis.GetDatabase();
                        result = await db.HashSetAsync(userId, key, value);
                        await db.KeyExpireAsync(userId, DateTime.UtcNow.AddHours(KeyExpiryHours));
                    }
                    return result;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool?> DeleteValueWithKey(string userId, string key)
        {
            try
            {
                bool? result;
                if (config != null)
                {
                    using (redis = ConnectionMultiplexer.Connect(config))
                    {
                        var db = redis.GetDatabase();
                        result = await db.HashDeleteAsync(userId, key);
                    }
                    return result;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task AddItemToList(string listName, string value)
        {
            try
            {
                if (config != null)
                {
                    using (redis = ConnectionMultiplexer.Connect(config))
                    {
                        var db = redis.GetDatabase();
                        await db.ListRightPushAsync(listName, value);
                    }
                }
            }
            catch (Exception)
            {
            }
        }

        public async Task RemoveItemFromList(string listName, string value)
        {
            try
            {
                if (config != null)
                {
                    using (redis = ConnectionMultiplexer.Connect(config))
                    {
                        var db = redis.GetDatabase();
                        await db.ListRemoveAsync(listName, value);
                    }
                }
            }
            catch (Exception)
            {
            }
        }

        public async Task<List<string>> GetAllItemsInList(string listName)
        {
            var result = new List<string>();
            try
            {
                if (config != null)
                {
                    using (redis = ConnectionMultiplexer.Connect(config))
                    {
                        var db = redis.GetDatabase();
                        var rawResult = (await db.ListRangeAsync(listName));
                        foreach (var redisval in rawResult)
                        {
                            if (redisval.HasValue)
                            {
                                result.Add(redisval!);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            return result;
        }
    }
}
