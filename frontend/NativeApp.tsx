import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GameBoardScreen, LobbyScreen} from '@screens';
import {Routes, ScreenTitles} from '@constants';
import {
  AppState,
  NativeEventSubscription,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {EventBus, navigationRef} from '@utils';
import {useEffect} from 'react';
import {RootSiblingParent} from 'react-native-root-siblings';

const Stack = createNativeStackNavigator();

export const NativeApp: React.FC<{}> = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  let appChangeListener: NativeEventSubscription | undefined = undefined;
  let appState = AppState.currentState;

  const _handleAppStateChange = (nextAppState: any) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      EventBus.initialiseEventBus();
    }
    appState = nextAppState;
  };

  useEffect(() => {
    EventBus.initialiseEventBus();
    appChangeListener = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    return () => {
      if (appChangeListener) {
        appChangeListener.remove();
      }
    };
  }, []);

  return (
    <RootSiblingParent>
      <NavigationContainer ref={navigationRef}>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <Stack.Navigator initialRouteName="home">
            <Stack.Screen
              name={Routes.Lobby}
              options={{title: ScreenTitles.Lobby, headerShown: false}}
              component={LobbyScreen}
            />
            <Stack.Screen
              name={Routes.Gameboard}
              options={{title: ScreenTitles.Gameboard, headerShown: false}}
              component={GameBoardScreen}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </RootSiblingParent>
  );
};
