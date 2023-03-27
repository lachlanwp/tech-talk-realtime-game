import {Player} from '@models';
import {PlayerConfig, Styles} from '@constants';
import {observer} from 'mobx-react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {gameState} from '../../App';
import {AnimatedAvatar} from '@components';
import {AppDraggable} from './AppDraggable';

export const PlayerAvatar: React.FC<{player?: Player}> = observer(
  ({player}) => {
    const getPlayerRenderedX = () => {
      const calculated = player!.posX;
      return calculated;
    };
    const getPlayerRenderedY = () => {
      const calculated = player!.posY;
      return calculated;
    };

    return (
      <>
        {player!.id === gameState.ownPlayer?.id ? (
          <AppDraggable player={player}>
            <AnimatedAvatar>
              <View style={[styles.avatarImage, styles.avatarImageMine]}>
                <Image
                  style={styles.avatarImageInner}
                  source={{uri: player!.avatarUrl}}
                />
              </View>
            </AnimatedAvatar>
            <Text style={styles.yourPlayerName}>{player?.name}</Text>
          </AppDraggable>
        ) : (
          <View
            style={{
              zIndex: 20,
              position: 'absolute',
              top: getPlayerRenderedY(),
              left: getPlayerRenderedX(),
            }}>
            <View style={[styles.avatarImage, styles.avatarImageYours]}>
              <AnimatedAvatar>
                <Image
                  style={[styles.avatarImageInner]}
                  source={{uri: player!.avatarUrl}}
                />
              </AnimatedAvatar>
            </View>
            <Text style={styles.otherPlayerName}>{player?.name}</Text>
          </View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  avatarImage: {
    width: PlayerConfig.AvatarDimension,
    height: PlayerConfig.AvatarDimension,
    borderRadius: PlayerConfig.AvatarDimension / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImageMine: {
    borderWidth: 2,
    borderColor: Styles.Colours.Primary,
    backgroundColor: Styles.Colours.Secondary,
  },
  avatarImageYours: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: Styles.Colours.SecondaryLighter,
  },
  avatarImageInner: {
    width: PlayerConfig.AvatarDimension - 12,
    height: PlayerConfig.AvatarDimension - 12,
    zIndex: 20,
  },
  otherPlayerName: {
    textAlign: 'center',
  },
  yourPlayerName: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
