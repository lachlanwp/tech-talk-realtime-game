using System;
namespace RealtimeGame
{
	public class EventBusMessageBase
	{
        public EventBusMessageTypes Type { get; set; }
    }

	public class EventBusMessage<T> : EventBusMessageBase
	{
		public T Payload { get; set; }
    }
}

