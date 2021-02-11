import React, {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {FONT} from '../constants/fonts';
import {THEME} from '../constants/theme';

export function ProgressLine({
  title = '',
  percent = 100,
  backgroundColor = THEME.DANGER_COLOR_DARK,
  height = 34,
  isActive,
}) {
  let bool = true;
  if (bool === isActive) {
    bool = false;
    console.log('bool', bool);
  }
  return (
    <View>
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>{title}</Text>
        <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: `${percent < 0 ? 0 : percent}%`,
              opacity: bool ? 1 : !isActive ? 1 : 0.3,
              backgroundColor: backgroundColor,
              height: height,
            }}
          />
          {percent <= 99 ? (
            <Text style={styles.progressPercent}>
              {'\u00A0'}
              {'\u00A0'}
              {percent} %
            </Text>
          ) : (
            <Text style={styles.progressPercent}>{percent} %</Text>
          )}
        </View>
        <View style={{flex: 1}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 10,
    marginBottom: 10,
  },
  progressTitle: {
    marginRight: 10,
    textAlign: 'right',
    flex: 2,
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
  },
  progressLine: {
    height: 34,
  },
  progressPercent: {
    marginLeft: 5,
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
  },
});
