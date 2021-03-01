import React from 'react';
import {Text, StyleSheet, View, Platform} from 'react-native';
import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

export function CountDownLabel() {
  return (
    <View style={styles.timeCountContainer}>
      <View style={{flex: 1}}>
        <Text style={[styles.timeCountLabel, {paddingRight: 5}]}>HR</Text>
      </View>
      <Text
        style={[
          styles.timeCountLabel,
          {paddingRight: Platform.OS === 'ios' ? 2 : 0},
        ]}>
        MIN
      </Text>
      <View style={{flex: 1}}>
        <Text
          style={[
            styles.timeCountLabel,
            {paddingLeft: Platform.OS === 'android' ? 2 : 0},
          ]}>
          SEC
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeCountContainer: {
    flexDirection: 'row',
    marginBottom: Platform.OS === 'ios' ? -2 : -8,
  },
  timeCountLabel: {
    flex: 1,
    textAlign: 'center',
    color: THEME.PEW_COLOR,
    fontSize: 8,
    fontFamily: FONT.Regular,
  },
});
