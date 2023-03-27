import {PlayerConfig} from '@constants';
import {StyleSheet, View} from 'react-native';

export const AnimatedAvatar: React.FC<{children?: any}> = ({children}) => {
  return <View style={styles.animatedAvatarContainer}>{children}</View>;
};
const styles = StyleSheet.create({
  animatedAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: PlayerConfig.AvatarDimension,
    height: PlayerConfig.AvatarDimension,
  },
});
