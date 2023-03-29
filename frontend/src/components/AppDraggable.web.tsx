import {EventBusMessageTypes, PlayerConfig} from '@constants';
import {throttle} from 'lodash';
import {Player} from '@models';
import {Platform, StyleSheet, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {EventBus} from '@utils';
import WebDraggable from 'react-draggable';

interface IProps {
  children?: any;
  player?: Player;
}

export const AppDraggable: React.FC<IProps> = ({children, player}) => {
  let draggableViewRef: any = undefined;
  let draggableX = player?.posX || 0;
  let draggableY = player?.posY || 0;

  const onDrageThrottled = throttle(() => {
    if (player) {
      EventBus.sendMessage(
        {
          id: player.id,
          posX: Math.round(draggableX),
          posY: Math.round(
            draggableY -
              Platform.select({ios: getStatusBarHeight(), default: 0}),
          ),
        },
        EventBusMessageTypes.UserMovement,
      );
    }
  }, 120);
  const onDrag = () => {
    draggableViewRef.measure(
      (
        _ox: number,
        _oy: number,
        _width: number,
        _height: number,
        px: number,
        py: number,
      ) => {
        draggableX = px;
        draggableY = py;
      },
    );
    onDrageThrottled();
  };

  return (
    <WebDraggable
      onDrag={onDrag}
      defaultPosition={{x: draggableX, y: draggableY}}>
      <View
        style={styles.avatarDimensions}
        ref={ref => (draggableViewRef = ref)}>
        {children}
      </View>
    </WebDraggable>
  );
};
const styles = StyleSheet.create({
  avatarDimensions: {
    width: PlayerConfig.AvatarDimension,
    height: PlayerConfig.AvatarDimension,
  },
});
