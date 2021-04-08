import React from 'react';
import * as Animatable from 'react-native-animatable';
import {Text, View} from 'react-native';

import {THEME} from '../constants/theme';
import {FONT} from '../constants/fonts';
import IconWifi from './icons/IconWifi';

export function NoInternetModal({animate = 'fadeInUpBig'}) {
  return (
    <Animatable.View
      animation={animate}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        width: '100%',
        bottom: 70,
      }}>
      <View
        style={{
          backgroundColor: '#E31C53',
          width: 254,
          borderRadius: 40,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <IconWifi />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 14,
            fontFamily: FONT.Regular,
            color: THEME.WHITE_COLOR,
            textTransform: 'uppercase',
            marginLeft: 10,
            marginTop: 3,
          }}>
          No Internet Connection
        </Text>
      </View>
    </Animatable.View>
  );
}
