import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

export function CardSpeed({speed = null, unit = ''}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <>
      <Text style={styles.label}>Speed</Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          alignItems: 'center',
        }}>
        <MaterialIcons
          name={'speed'}
          size={35}
          color={THEME.PRIMARY_COLOR_DARK}
          style={{marginRight: 20}}
        />
        <Text
          style={{
            fontSize: 17,
            fontFamily: FONT.Medium,
            color: THEME.PRIMARY_COLOR_DARK,
            marginRight: 10,
          }}>
          {_.floor(speed, 1)}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setVisible(!visible)}>
          <Text
            numberOfLines={visible ? 1 : undefined}
            ellipsizeMode={'tail'}
            style={styles.textBlue}>
            {unit}
          </Text>
        </TouchableOpacity>
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
