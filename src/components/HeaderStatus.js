import * as React from 'react';
import {Platform, StatusBar} from 'react-native';

function HeaderStatus({ios = 'light', android = 'light'}) {
  return (
    <>
      {Platform.OS === 'ios' ? (
        <StatusBar barStyle={`${ios}-content`} />
      ) : (
        <StatusBar barStyle={`${android}-content`} />
      )}
    </>
  );
}

export default HeaderStatus;
