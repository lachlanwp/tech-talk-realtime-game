enum Events {
  JoinGame = 'join-game',
  LeaveGame = 'leave-game',
}

export type EventNames = Events.JoinGame | Events.LeaveGame;

export {Events};
