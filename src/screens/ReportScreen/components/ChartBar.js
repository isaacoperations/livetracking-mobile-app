import React from 'react';
import {View} from 'react-native';
import {THEME} from '../../../constants/theme';

export function ChartBar() {
  return (
    <View>
      <View
        style={{
          width: 6,
          height: 2.5,
          marginBottom: 2.5,
          backgroundColor: THEME.DARK_COLOR,
        }}
      />
      <View
        style={{
          width: 9.5,
          height: 2.5,
          marginBottom: 2.5,
          backgroundColor: THEME.DARK_COLOR,
        }}
      />
      <View
        style={{
          width: 13,
          height: 2.5,
          backgroundColor: THEME.DARK_COLOR,
        }}
      />
    </View>
  );
}
