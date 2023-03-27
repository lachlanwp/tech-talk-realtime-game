using System;
namespace RealtimeGame
{
	public static class AppConstants
    {
        public static string GAME_EVENT_BUS = "GAME_EVENT_BUS";
        public static string GAME_TEAM_NAME = "BOTS";
        public static string GAME_LAST_KNOWN = "LAST_KNOWN";
    }

	public enum EventBusMessageTypes {
		UserMovement = 1,
		UserJoined = 2,
		UserLeft = 3,
        UserList = 4,
        EchoPresence = 5
    }
}

