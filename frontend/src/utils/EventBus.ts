import {EventBusMessageTypes, DateFormattingStrings, Routes} from '@constants';
import {EventBusMessage, Player} from '@models';
import {gameState} from '../../App';
import moment from 'moment';
import {difference, get} from 'lodash';
import * as RootNavigation from './NavigationService';
import {showToast} from './Toast';

const wsUri = 'wss://cloud.lachlanpearce.com';
const echoMillis = 2000;
//@ts-ignore
export let socket: WebSocket | undefined;
let echoInterval: any | undefined;

const sendMessage = <T>(Payload: T, Type: any) => {
  try {
    if (socket) {
      socket.send(
        JSON.stringify({
          Payload,
          Type,
        } as EventBusMessage<T>),
      );
    }
  } catch (exception) {}
};

const initialiseEventBus = () => {
  if (!gameState.eventBusOpen) {
    closeEventBus();

    //@ts-ignore
    // eslint-disable-next-line no-undef
    socket = new WebSocket(wsUri);

    socket.onmessage = (e: any) => {
      var event = JSON.parse(e.data) as EventBusMessage<any>;

      switch (event.Type) {
        case EventBusMessageTypes.UserList:
          const localPlayerIds = gameState.joinedPlayers.map(
            (x: Player) => x.id,
          );
          const remotePlayerIds = event.Payload.map((x: Player) => x.id);
          const allPlayers = gameState.joinedPlayers.concat(event.Payload);
          // new players are in remote but not in local
          const newPlayerIds = difference(remotePlayerIds, localPlayerIds);
          const newPlayers = allPlayers.filter(x =>
            newPlayerIds.includes(x.id),
          );
          // left players are in local but not in remote
          const leavingPlayerIds = difference(localPlayerIds, remotePlayerIds);
          const leavingPlayers = allPlayers.filter(x =>
            leavingPlayerIds.includes(x.id),
          );
          newPlayers.forEach((newPlayer: Player) => {
            gameState.addPlayer(newPlayer);
            const ownPlayerId = get(gameState, 'ownPlayer.id', false);
            if (ownPlayerId && ownPlayerId !== newPlayer.id) {
              showToast(`${newPlayer.name} joined the party 🥳`);
            }
          });
          leavingPlayers.forEach((leavingPlayer: Player) => {
            if (leavingPlayer) {
              gameState.removePlayer(leavingPlayer);
              const ownPlayerId = get(gameState, 'ownPlayer.id', false);
              if (ownPlayerId && ownPlayerId !== leavingPlayer.id) {
                showToast(`${leavingPlayer.name} left 🚪`);
              }
              if (leavingPlayer.id === ownPlayerId) {
                gameState.clearOwnPlayer();
                if (RootNavigation) {
                  RootNavigation.navigate(Routes.Lobby, undefined);
                }
                gameState.setWebRoute(Routes.Lobby);
              }
            }
          });
          break;
        case EventBusMessageTypes.UserMovement:
          if (event.Payload.id !== gameState.ownPlayer?.id) {
            gameState.updatePlayerPosition(
              event.Payload.id,
              event.Payload.posX,
              event.Payload.posY,
            );
          }
          break;
      }
    };

    socket.onclose = () => {
      gameState.closeEventBus();
    };

    socket.onopen = () => {
      gameState.openEventBus();
    };

    echoInterval = setInterval(() => {
      try {
        if (socket && gameState.eventBusOpen) {
          if (gameState.ownPlayer?.id) {
            socket.send(
              JSON.stringify({
                Payload: {
                  id: gameState.ownPlayer?.id,
                },
                Type: EventBusMessageTypes.EchoPresence,
              }),
            );
          } else {
            socket.send('echo');
          }
        }
      } catch (exception) {}
    }, echoMillis);
  }
};

const closeEventBus = () => {
  if (echoInterval) {
    clearInterval(echoInterval);
  }
  if (socket) {
    socket.close();
  }
};

export const EventBus = {
  initialiseEventBus,
  closeEventBus,
  sendMessage,
};
