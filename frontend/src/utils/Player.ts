import {baseAvatarUrl} from '@constants';
import {Player} from '@models';
import {getUniqueId} from 'react-native-device-info';
import {Platform} from 'react-native';
import {getWebMachineId} from './IdGenerator';

const CreatePlayer = async (
  posX: number,
  posY: number,
  playerName: string,
): Promise<Player> => {
  const id = Platform.select({
    web: getWebMachineId(),
    default: await getUniqueId(),
  });
  return {
    id,
    name: playerName,
    avatarUrl: `${baseAvatarUrl}${id}`,
    posX,
    posY,
    lastSeenUtc: '',
  };
};

export {CreatePlayer};
