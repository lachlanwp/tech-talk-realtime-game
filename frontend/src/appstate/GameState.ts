import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import {Player} from '@models';
import {Routes} from '@constants';

interface IGameState {
  ownPlayer: Player | undefined;
  eventBusOpen: boolean;
  joinedPlayers: Player[];
  webRoute: string;

  addPlayer(player: Player): void;
  removePlayer(player: Player): void;
  updatePlayerPosition(id: string, posX: number, posY: number): void;
  openEventBus(): void;
  closeEventBus(): void;
  setOwnPlayer(player: Player): void;
  clearOwnPlayer(): void;
  setWebRoute(route: string): void;
  playerReady(): boolean;
}

export class GameState implements IGameState {
  ownPlayer: Player | undefined = undefined;
  eventBusOpen: boolean = false;
  joinedPlayers: Player[] = [];
  webRoute = Routes.Lobby;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'gameState',
      properties: [],
      storage: AsyncStorage,
    }).then((value: any) => {});
  }

  addPlayer(player: Player): void {
    if (!this.joinedPlayers.find((x: Player) => x.id === player.id)) {
      this.joinedPlayers.push(player);
    }
  }

  removePlayer(player: Player): void {
    this.joinedPlayers = this.joinedPlayers.filter(
      (x: Player) => x.id !== player.id,
    );
  }

  updatePlayerPosition(id: string, posX: number, posY: number): void {
    this.joinedPlayers.forEach((x: Player) => {
      if (x.id === id) {
        x.posX = posX;
        x.posY = posY;
      }
      return x;
    });
  }

  openEventBus(): void {
    this.eventBusOpen = true;
  }

  closeEventBus(): void {
    this.eventBusOpen = false;
  }

  setOwnPlayer(player: Player): void {
    this.ownPlayer = player;
  }

  clearOwnPlayer(): void {
    this.ownPlayer = undefined;
  }

  setWebRoute(route: string): void {
    this.webRoute = route;
  }

  playerReady(): boolean {
    const inGameIds = this.joinedPlayers.map(x => x.id);
    return inGameIds.includes(this.ownPlayer?.id || '');
  }

  reset(): void {
    this.joinedPlayers = [];
  }
}
