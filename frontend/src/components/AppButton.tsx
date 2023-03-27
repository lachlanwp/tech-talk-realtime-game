import {AppTouchable} from '@components';
import {EventNames, Styles} from '@constants';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

export const AppButton: React.FC<{
  event: EventNames;
  eventParams?: any;
  label?: string;
  element?: JSX.Element;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}> = ({event, eventParams, label, element, onPress, loading, disabled}) => {
  return (
    <View style={styles.buttonOuter}>
      {loading ? (
        <ActivityIndicator
          size={'small'}
          color={Styles.Colours.PrimaryLighter}></ActivityIndicator>
      ) : (
        <AppTouchable
          style={[
            styles.button,
            element ? {paddingHorizontal: 6} : {},
            disabled ? {opacity: 0.5} : {},
          ]}
          event={event}
          eventParams={eventParams}
          disabled={disabled}
          onPress={onPress}>
          {element ? element : <Text style={styles.text}>{label}</Text>}
        </AppTouchable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Styles.Colours.Primary,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Styles.Colours.PrimaryLighter,
  },
  text: {
    color: Styles.Colours.Light,
    fontSize: 18,
  },
  buttonOuter: {
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
