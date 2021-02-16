import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import moment from 'moment';

import {FONT} from '../constants/fonts';
import {THEME} from '../constants/theme';

export function ProgressContent({
  title = '',
  percent = 100,
  time = '',
  isActive,
}) {
  const minute = moment().startOf('hour').seconds(time).format('mm');
  const second = moment().startOf('hour').seconds(time).format('ss');
  return (
    <View
      style={[
        styles.progressInfo,
        {
          marginBottom: isActive ? 10 : 0,
          padding: isActive ? 30 : 0,
          paddingBottom: isActive ? 2 : 0,
        },
      ]}>
      <View style={{justifyContent: 'space-between', marginRight: 15}}>
        <Text style={[styles.progressInfoText, styles.uppercase]}>Reason</Text>
        <Text style={[styles.progressInfoText, styles.uppercase]}>
          Lost time
        </Text>
        <Text style={[styles.progressInfoText, styles.uppercase]}>
          Percentage
        </Text>
      </View>
      <View style={{justifyContent: 'space-between'}}>
        <Text style={styles.progressInfoText}>{title}</Text>
        <Text style={styles.progressInfoText}>
          {`${minute}m ${second}s`}
        </Text>
        <Text style={styles.progressInfoText}>{percent} %</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressInfo: {
    flex: 1,
    padding: 30,
    paddingBottom: 2,
    backgroundColor: THEME.PRIMARY_COLOR_DARK,
    flexDirection: 'row',
  },
  progressInfoText: {
    fontFamily: FONT.Regular,
    fontSize: 12,
    color: THEME.WHITE_COLOR,
    marginBottom: 28,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
