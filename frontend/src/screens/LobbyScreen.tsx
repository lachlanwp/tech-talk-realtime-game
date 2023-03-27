import {AppButton} from '@components';
import {
  baseAvatarUrl,
  EventBusMessageTypes,
  Events,
  GetTranslation,
  Routes,
  Styles,
} from '@constants';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {CreatePlayer, EventBus} from '@utils';
import {useEffect, useState} from 'react';
import {gameState} from '../../App';
import {observer} from 'mobx-react';
import {getRandomCoords} from '@utils';
import {useWindowDims} from '@hooks';
import {autorun} from 'mobx';

export const LobbyScreen: React.FC<{navigation?: any}> = observer(
  ({navigation}) => {
    const [isJoining, setIsJoining] = useState(false);
    const {width, height} = useWindowDims();
    const [playerName, setPlayerName] = useState('');

    useEffect(() => {}, []);

    autorun(() => {
      if (gameState.playerReady() && isJoining) {
        if (navigation) {
          navigation.navigate(Routes.Gameboard);
        }
        gameState.setWebRoute(Routes.Gameboard);
        setIsJoining(false);
      }
    });

    const gotoGameboard = () => {
      setIsJoining(true);
      setTimeout(async () => {
        const coords = getRandomCoords(width, height);
        const newPlayer = await CreatePlayer(coords[0], coords[1], playerName);
        gameState.setOwnPlayer(newPlayer);
        EventBus.sendMessage(newPlayer, EventBusMessageTypes.UserJoined);
      }, 500);
    };

    const onChangeName = (name: string) => {
      setPlayerName(name);
    };

    return (
      <View style={styles.rootView}>
        <View style={styles.appName}>
          <Text style={styles.appTitle}>
            {GetTranslation('en_AU', 'AppTitle')}
          </Text>
          <Image
            style={styles.homescreenBot}
            source={{uri: `${baseAvatarUrl}botrevenge`}}
          />
        </View>
        <View style={styles.nameInputContainer}>
          <Text>Enter your name to join the party!</Text>
          <TextInput
            editable={!isJoining}
            onChangeText={onChangeName}
            style={styles.nameInput}></TextInput>
        </View>
        <AppButton
          label="Join game"
          event={Events.JoinGame}
          onPress={gotoGameboard}
          loading={isJoining}
          disabled={!playerName}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  rootView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {color: '#000000'},
  homescreenBot: {
    width: 120,
    height: 120,
    margin: 20,
  },
  appName: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameInputContainer: {
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: Styles.Colours.Primary,
    padding: 4,
    marginTop: 6,
    borderRadius: 4,
    textAlign: 'center',
    minWidth: 180,
  },
  appTitle: {
    fontWeight: 'bold',
    fontSize: 30,
  },
});
