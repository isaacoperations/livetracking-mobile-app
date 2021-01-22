import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {FONT} from '../constants/fonts';
import {THEME} from '../constants/theme';

export function ProgressLine({
  title = '',
  percent = 100,
  percentShow = true,
  info = '',
  opacity = 1,
  show = false,
  backgroundColor = THEME.DANGER_COLOR_DARK,
  height = 34,
}) {
  const widthPercent = percent;
  return (
    <View>
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>{title}</Text>
        <View style={{flex: 3, width: '100%'}}>
          <View
            style={{
              width: `${widthPercent}%`,
              opacity: opacity,
              backgroundColor: backgroundColor,
              height: height,
            }}
          />
        </View>
        {percentShow ? (
          percent <= 99 ? (
            <Text style={styles.progressPercent}>
              {'\u00A0'}
              {'\u00A0'}
              {percent} %
            </Text>
          ) : (
            <Text style={styles.progressPercent}>{percent} %</Text>
          )
        ) : null}
      </View>
      {show ? (
        <View style={styles.progressInfo}>
          <Text style={[styles.progressInfoText, {marginBottom: 4}]}>
            {title}
          </Text>
          <Text style={[styles.progressInfoText, {marginBottom: 15}]}>X %</Text>
          <Text style={styles.progressInfoText}>{info}</Text>
        </View>
      ) : null}
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
  progressInfo: {
    flex: 1,
    padding: 30,
    backgroundColor: '#F2F2F2',
    marginLeft: -30,
    marginRight: -30,
  },
  progressInfoText: {
    fontFamily: FONT.Regular,
    fontSize: 12,
    color: THEME.CHAR_COLOR,
  },
});
