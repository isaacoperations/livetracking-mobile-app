import React from 'react';
import {Text, StyleSheet, View, Platform} from 'react-native';
import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

export function CountLabel() {
  return (
    <View style={styles.timeCountContainer}>
      <Text style={[styles.timeCountLabel]}>HR</Text>
      <Text style={[styles.timeCountLabel]}>MIN</Text>
      <Text style={[styles.timeCountLabel]}>SEC</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timeCountContainer: {
    flexDirection: 'row',
    marginBottom: Platform.OS === 'ios' ? 2 : 0,
  },
  timeCountLabel: {
    flex: 1,
    textAlign: 'center',
    color: THEME.PEW_COLOR,
    fontSize: 8,
    fontFamily: FONT.Regular,
  },
});
