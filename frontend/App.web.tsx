import React, {useEffect} from 'react';
import {View} from 'react-native';
import {GameBoardScreen, LobbyScreen} from '@screens';
import {GameState} from './src/appstate';
import {Routes} from '@constants';
import {observer} from 'mobx-react';
import {EventBus} from '@utils';
import {Toaster} from 'react-hot-toast';

const gameState = new GameState();
gameState.eventBusOpen = false;

declare var window: any;

const App = observer(() => {
  useEffect(() => {
    window.addEventListener('focus', () => {
      EventBus.initialiseEventBus();
    });
    EventBus.initialiseEventBus();
  }, []);

  return (
    <View style={{flex: 1}}>
      {gameState.webRoute === Routes.Lobby ? (
        <LobbyScreen />
      ) : gameState.webRoute === Routes.Gameboard ? (
        <GameBoardScreen />
      ) : (
        <>not found</>
      )}
      <Toaster
        toastOptions={{
          position: 'bottom-center',
          style: {
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          },
        }}
      />
    </View>
  );
});

export {App, gameState};
