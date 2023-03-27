import 'react-native-get-random-values';
import {Platform} from 'react-native';
import {v4 as uuidv4} from 'uuid';

declare var localStorage: any;

const getWebMachineId = () => {
  if (Platform.OS === 'web') {
    let machineId = localStorage.getItem('MachineId');

    if (!machineId) {
      machineId = idGenerator();
      localStorage.setItem('MachineId', machineId);
    }

    return machineId;
  } else {
    return idGenerator();
  }
};

const idGenerator = () => {
  return uuidv4();
};

export {idGenerator, getWebMachineId};
