import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {FONT} from '../../constants/fonts';
import {THEME} from '../../constants/theme';

export function TabBadge({name, badgeCount, color = THEME.WHITE_COLOR, size}) {
  return (
    <View style={{width: 24, height: 24, margin: 5}}>
      {badgeCount > 0 ? (
        <View style={styles.badgeContainer}>
          <Text
            style={{
              color: 'white',
              fontSize: 10,
            }}>
            0
          </Text>
        </View>
      ) : (
        <View />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 20,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeStyle: {
    minWidth: 44,
    marginLeft: 'auto',
  },
  textStyle: {
    fontSize: 10,
    fontFamily: FONT.Regular,
    textTransform: 'uppercase',
  },
});
