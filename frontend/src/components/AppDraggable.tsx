import {EventBusMessageTypes, PlayerConfig} from '@constants';
import {throttle} from 'lodash';
import {Player} from '@models';
import {Platform, View} from 'react-native';
import Draggable from 'react-native-draggable';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {EventBus} from '@utils';

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
    <Draggable
      x={draggableX}
      y={draggableY}
      renderSize={PlayerConfig.AvatarDimension}
      onDrag={onDrag}>
      <View ref={ref => (draggableViewRef = ref)}>{children}</View>
    </Draggable>
  );
};
