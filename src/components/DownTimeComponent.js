import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {FONT} from '../constants/fonts';
import {THEME} from '../constants/theme';

export function DownTimeComponent({title, subTitle, time, percent}) {
  return (
    <View style={styles.blockNode}>
      <Text style={styles.labelTime}>2020-Aug-18 11:56 AM</Text>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {subTitle}
      </Text>
      <View style={styles.blockNodeBottom}>
        <Text
          style={[
            styles.text,
            {fontSize: 14, marginRight: 20, marginBottom: 0},
          ]}>
          {time}
        </Text>
        <View style={[styles.progressLine, {width: `${percent}%`}]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  blockNode: {
    backgroundColor: THEME.WHITE_COLOR,
    paddingRight: 100,
    marginBottom: 0,
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 10,
  },
  blockNodeBottom: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  labelTime: {
    color: THEME.PRIMARY_COLOR,
    fontSize: 11,
    fontFamily: FONT.Regular,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  title: {
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    marginBottom: 5,
  },
  progressLine: {
    width: '100%',
    opacity: 1,
    backgroundColor: THEME.DANGER_COLOR_DARK,
    height: 14,
  },
});
