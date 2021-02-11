import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {FONT} from '../constants/fonts';
import {THEME} from '../constants/theme';

export function ProgressContent({title = '', percent = 100, info = ''}) {
  return (
    <View style={styles.progressInfo}>
      <Text style={[styles.progressInfoText, {marginBottom: 4}]}>{title}</Text>
      <Text style={[styles.progressInfoText, {marginBottom: 15}]}>
        {percent} %
      </Text>
      <Text style={styles.progressInfoText}>{info}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressInfo: {
    flex: 1,
    padding: 30,
    backgroundColor: '#F2F2F2',
  },
  progressInfoText: {
    fontFamily: FONT.Regular,
    fontSize: 12,
    color: THEME.CHAR_COLOR,
  },
});
