import {EventBusMessageTypes, Events, Routes} from '@constants';
import {gameState} from '../../App';
import {Image, StyleSheet, View} from 'react-native';
import {EventBus} from '@utils';
import {observer} from 'mobx-react';
import {AppButton, PlayerAvatar} from '@components';
import {Player} from '@models';

export const GameBoardScreen: React.FC<{navigation?: any}> = observer(
  ({navigation}) => {
    const gotoLobby = () => {
      EventBus.sendMessage(gameState.ownPlayer, EventBusMessageTypes.UserLeft);
      gameState.clearOwnPlayer();
      if (navigation) {
        navigation.navigate(Routes.Lobby);
      }
      gameState.setWebRoute(Routes.Lobby);
    };

    return (
      <View style={styles.rootView}>
        <View style={styles.absoluteButton}>
          <View>
            <AppButton
              element={
                <Image
                  source={{
                    uri: 'https://robots.lachlanpearce.com/close-icon.png',
                  }}
                  style={styles.closeIcon}
                />
              }
              event={Events.LeaveGame}
              onPress={gotoLobby}
            />
          </View>
        </View>
        <View style={styles.gameboardFlexed}>
          {gameState.joinedPlayers.map((player: Player) => {
            return <PlayerAvatar key={player.id} player={player} />;
          })}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  text: {color: '#000000'},
  leaveGameButton: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  absoluteButton: {
    height: 60,
    zIndex: 10,
    alignItems: 'flex-end',
    padding: 10,
    position: 'absolute',
    width: '100%',
  },
  gameboardFlexed: {
    flex: 1,
    height: '100%',
    width: '100%',
    zIndex: 5,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
});
