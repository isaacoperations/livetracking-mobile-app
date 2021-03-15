import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

export function CardProductDesc({description}) {
  const [visible, setVisible] = useState(true);
  return (
    <>
      <Text style={styles.label}>Description</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(!visible)}>
        <Text
          numberOfLines={visible ? 2 : undefined}
          ellipsizeMode={'tail'}
          style={styles.text}>
          {description}
        </Text>
      </TouchableOpacity>
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
