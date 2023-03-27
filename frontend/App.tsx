import React from 'react';
import {GameState} from './src/appstate';
import {NativeApp} from './NativeApp';

const gameState = new GameState();
gameState.eventBusOpen = false;

const App = () => <NativeApp />;

export {App, gameState};
