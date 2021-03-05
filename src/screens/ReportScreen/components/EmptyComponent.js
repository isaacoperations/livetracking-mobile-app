import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';
import IconBox from '../../../components/icons/IconBox';

export function EmptyComponent({
  title = 'You have no lines in your watch list',
}) {
  return (
    <View style={styles.noLineContainer}>
      <IconBox style={{marginBottom: 15}} />
      <Text style={styles.subtitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noLineContainer: {
    marginTop: 'auto',
    marginBottom: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PEW_COLOR,
    textAlign: 'center',
  },
});
