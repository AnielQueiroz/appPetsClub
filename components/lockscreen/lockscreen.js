import React, { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

function withPortraitOrientation(Component) {
  return function WithPortraitOrientation(props) {
    useEffect(() => {
      async function lockScreenOrientation() {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }

      lockScreenOrientation();
    }, []);

    return <Component {...props} />;
  };
}

export default withPortraitOrientation;
