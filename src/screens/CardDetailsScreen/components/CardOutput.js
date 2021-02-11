import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';
import IconCubes from '../../../components/icons/IconCubes';

export function CardOutput({title = '', unit = ''}) {
  return (
    <>
      <Text style={styles.label}>OUTPUT</Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          alignItems: 'center',
        }}>
        <IconCubes style={{marginRight: 20}} />
        <Text
          style={{
            fontSize: 17,
            fontFamily: FONT.Medium,
            color: THEME.PRIMARY_COLOR_DARK,
            marginRight: 10,
          }}>
          {title}
        </Text>
        <Text style={styles.textBlue}>{unit}</Text>
      </View>
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
  },
  textBlue: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PRIMARY_COLOR_DARK,
    marginBottom: 0,
  },
});
