import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {FONT} from '../constants/fonts';
import {THEME} from '../constants/theme';

export function ProgressLine({
  index,
  title = '',
  percent = 100,
  backgroundColor = THEME.DANGER_COLOR_DARK,
  height = 34,
  isActive,
  sections,
}) {

  const sectionAll = sections?.length || 5;

  let number = 100 / sectionAll + 10 * percent + 20;
  console.log('asdasd', number, index);
  let indexWidth;
  if (index === 0) {
    indexWidth = 100;
  } else {
    if (number < 101) {
      indexWidth = number;
    } else {
      indexWidth = number / 20;
    }
    if (percent === 0) {
      indexWidth = 0;
    }
  }

  return (
    <View style={[styles.progressContainer, {marginBottom: isActive ? 0 : 10}]}>
      <Text style={styles.progressTitle}>{title}</Text>
      <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: `${indexWidth}%`,
            opacity: !isActive ? 1 : 0.3,
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
