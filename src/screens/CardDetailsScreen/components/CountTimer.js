import React from 'react';
import {Text, StyleSheet, View, Platform} from 'react-native';
import moment from 'moment';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

export function CountTimer({durationSeconds, status}) {
  let hours = moment().startOf('day').seconds(durationSeconds).format('HH');
  let minutes = moment().startOf('day').seconds(durationSeconds).format('mm');
  let secondes = moment().startOf('day').seconds(durationSeconds).format('ss');

  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={[styles.timeCountContainer]}>
        <Text style={[styles.timeCountLabel]}>HR</Text>
        <Text
          style={[
            styles.timeCount,
            {
              color:
                status !== 'down'
                  ? THEME.PRIMARY_COLOR_DARK
                  : THEME.DANGER_COLOR,
            },
          ]}>
          {hours}
        </Text>
      </View>
      <Text style={styles.timeSeparator}>:</Text>
      <View style={[styles.timeCountContainer]}>
        <Text style={[styles.timeCountLabel]}>MIN</Text>
        <Text
          style={[
            styles.timeCount,
            {
              color:
                status !== 'down'
                  ? THEME.PRIMARY_COLOR_DARK
                  : THEME.DANGER_COLOR,
            },
          ]}>
          {minutes}
        </Text>
      </View>
      <Text style={styles.timeSeparator}>:</Text>
      <View style={[styles.timeCountContainer]}>
        <Text style={[styles.timeCountLabel]}>SEC</Text>
        <Text
          style={[
            styles.timeCount,
            {
              color:
                status !== 'down'
                  ? THEME.PRIMARY_COLOR_DARK
                  : THEME.DANGER_COLOR,
            },
          ]}>
          {secondes}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeCountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeCount: {
    color: THEME.PRIMARY_COLOR_DARK,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? FONT.SemiBold : FONT.Bold,
  },
  timeSeparator: {
    color: THEME.ASH_COLOR,
    fontSize: 20,
    fontFamily: FONT.Bold,
    marginHorizontal: 10,
    height: Platform.OS === 'ios' ? 21 : 28,
    marginTop: 'auto',
  },
  timeCountLabel: {
    color: THEME.PEW_COLOR,
    fontSize: 8,
    fontFamily: FONT.Regular,
    marginBottom: Platform.OS === 'ios' ? 1 : -5,
    marginTop: Platform.OS === 'ios' ? 0 : 4,
  },
});
