import {createNavigationContainerRef} from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

const navigate = (name: string, params: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
};

export {navigate, navigationRef};
