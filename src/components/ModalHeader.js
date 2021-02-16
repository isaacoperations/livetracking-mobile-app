import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {FONT} from '../constants/fonts';
import {THEME} from '../constants/theme';

export function ModalHeader({
  title = '',
  onPressClose,
  onPressSetting,
  iconShow = false,
  iconTitleClose = 'close',
  iconTitleSetting = 'setting',
  backgroundColor = 'transparent',
  iconColor = THEME.DARK_COLOR,
}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 56,
        backgroundColor: backgroundColor,
      }}>
      <View style={styles.closeContainer}>
        <TouchableOpacity onPress={onPressClose} style={styles.close}>
          <MaterialIcons color={iconColor} size={20} name={iconTitleClose} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
        }}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.settingContainer}>
        {iconShow && (
          <TouchableOpacity onPress={onPressSetting} style={styles.close}>
            <MaterialIcons color={iconColor} size={20} name={iconTitleSetting} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: THEME.DARK_COLOR,
    fontSize: 17,
    fontFamily: FONT.Medium,
    textAlign: 'center',
  },
  closeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
  },
  settingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 20,
  },
  close: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
