import {useEffect, useState} from 'react';

declare var document: any;

const useWindowDims = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(document.getElementsByTagName('body')[0].offsetWidth);
    setHeight(document.getElementsByTagName('body')[0].offsetHeight);
  }, []);

  return {width, height};
};

export {useWindowDims};
