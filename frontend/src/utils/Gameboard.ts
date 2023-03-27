import {PlayerConfig} from '@constants';

const getRandomCoords = (width: number, height: number): number[] => {
  let randX = Math.random() * width;
  let randY = Math.random() * height;

  if (randX > width - PlayerConfig.AvatarDimension - 100) {
    randX = width - PlayerConfig.AvatarDimension - 100;
  }
  if (randY > height - PlayerConfig.AvatarDimension - 100) {
    randY = height - PlayerConfig.AvatarDimension - 100;
  }
  if (randX < PlayerConfig.AvatarDimension) {
    randX = PlayerConfig.AvatarDimension + 100;
  }
  if (randY < PlayerConfig.AvatarDimension) {
    randY = PlayerConfig.AvatarDimension + 100;
  }

  return [randX, randY];
};

export {getRandomCoords};
