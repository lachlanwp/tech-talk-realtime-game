using System;
namespace RealtimeGame.Payloads
{
    public class AppPlayerPresence
    {
        public string id { get; set; }

        public AppPlayerPresence()
        {
            id = "";
        }
    }
    public class AppPlayerBasic
    {
        public string id { get; set; }
        public string name { get; set; }
        public string avatarUrl { get; set; }

        public AppPlayerBasic()
        {
            id = "";
            name = "";
            avatarUrl = "";
        }
    }
    public class AppPlayerWithPositionOnly
    {
        public string id { get; set; }
        public double posX { get; set; }
        public double posY { get; set; }

        public AppPlayerWithPositionOnly()
        {
            id = "";
        }
    }
	public class AppPlayer
    {
        public string id { get; set; }
        public string name { get; set; }
        public string avatarUrl { get; set; }
        public string lastSeenUtc { get; set; }
        public double posX { get; set; }
        public double posY { get; set; }

        public AppPlayer()
        {
            id = "";
            name = "";
            avatarUrl = "";
            lastSeenUtc = "";
        }
    }
}

