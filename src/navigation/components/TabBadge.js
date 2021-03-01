import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {FONT} from '../../constants/fonts';
import {THEME} from '../../constants/theme';

export function TabBadge({
  name,
  badgeCount,
  color = THEME.WHITE_COLOR,
  size,
  isShow,
}) {
  return (
    <View>
      {name}
      {badgeCount > 0 ? (
        <View style={[styles.badgeContainer, styles.badgeContainerBig]}>
          <Text style={styles.textStyle}>{badgeCount}</Text>
        </View>
      ) : isShow ? (
        <View style={styles.badgeContainer} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: 0,
    top: 1,
    backgroundColor: 'red',
    borderRadius: 20,
    width: 7,
    height: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainerBig: {
    right: -4,
    top: -1,
    width: 12,
    height: 12,
  },
  textStyle: {
    fontSize: 9,
    fontFamily: FONT.Regular,
    color: 'white',
  },
});
