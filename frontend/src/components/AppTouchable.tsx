import {EventNames} from '@constants';
import {
  GestureResponderEvent,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface IProps extends TouchableOpacityProps {
  event: EventNames;
  eventParams: any;
  children?: any;
}

export const AppTouchable: React.FC<IProps> = ({
  event,
  eventParams,
  children,
  ...props
}) => {
  const onTouchablePress = (event: GestureResponderEvent) => {
    if (props.onPress) {
      props.onPress(event);
    }
  };
  return (
    <TouchableOpacity onPress={onTouchablePress} {...props}>
      {children}
    </TouchableOpacity>
  );
};
