import React from 'react';
import {ActivityIndicator, View} from 'react-native';

import {THEME} from '../constants/theme';
import LogoWhiteSvg from './icons/LogoWhite';

export function SplashScreenComponent({indicator = true}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: THEME.PRIMARY_COLOR,
      }}>
      <LogoWhiteSvg />
      {indicator ? (
        <ActivityIndicator color={THEME.WHITE_COLOR} style={{marginTop: 20}} />
      ) : null}
    </View>
  );
}
