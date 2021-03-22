import React from 'react';
import {Text, StyleSheet, View, Platform} from 'react-native';
import {Avatar} from 'react-native-elements'
import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

import LogoMini from '../../../components/icons/LogoMini';

export function SettingUserInfo({
  name = 'Guest',
  email = 'example@livetracking.io',
  avatar,
}) {
  return (
    <View style={styles.rowUser}>
      <View style={styles.avatar}>
        {avatar ? (
          <Avatar rounded source={{uri: avatar}} />
        ) : (
          <LogoMini fill={THEME.DARK_COLOR} width={25} height={25} />
        )}
      </View>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowUser: {
    height: 110,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  avatar: {
    width: 40,
    height: 40,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingRight: 5,
  },
  name: {
    color: THEME.DARK_COLOR,
    fontSize: 17,
    fontFamily: FONT.Medium,
  },
  email: {
    marginTop: Platform.OS === 'android' ? -10 : 0,
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
  },
});
