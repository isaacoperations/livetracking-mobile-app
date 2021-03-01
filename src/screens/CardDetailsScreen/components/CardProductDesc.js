import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

export function CardProductDesc({description}) {
  return (
    <>
      <Text style={styles.label}>Description</Text>
      <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
        {description}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: THEME.PEW_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 17,
    fontFamily: FONT.Medium,
    color: THEME.DARK_COLOR,
    marginBottom: 20,
    marginTop: -5,
  },
});
