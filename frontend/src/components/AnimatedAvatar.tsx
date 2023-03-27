import {PlayerConfig} from '@constants';
import * as Animatable from 'react-native-animatable';
import {StyleSheet} from 'react-native';

export const AnimatedAvatar: React.FC<{children?: any}> = ({children}) => {
  return (
    <Animatable.View
      animation="bounceIn"
      style={styles.animatedAvatarContainer}>
      {children}
    </Animatable.View>
  );
};
const styles = StyleSheet.create({
  animatedAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: PlayerConfig.AvatarDimension,
    height: PlayerConfig.AvatarDimension,
  },
});
