import React, {useEffect} from 'react';
import {StyleSheet, Text, Pressable, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';
import LogoMini from '../../../components/icons/LogoMini';

export function SelectFactoryItem({
  id = 0,
  title = 'Test Organization',
  description = 'Test Factory Etobicoke North',
  onPress,
  iconShow = false,
  isActive = 1,
}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        {
          backgroundColor:
            id === isActive
              ? THEME.PRIMARY_COLOR_DARK
              : pressed
              ? THEME.PRIMARY_COLOR_DARK
              : 'transparent',
        },
        styles.wrapperCustom,
      ]}>
      {({pressed}) => (
        <>
          <View style={styles.closeContainer}>
            {id === isActive ? <LogoMini /> : pressed ? <LogoMini /> : null}
          </View>
          <View
            style={{
              flex: 3,
              justifyContent: 'center',
            }}>
            <Text
              style={[
                styles.headerTitle,
                {
                  color:
                    id === isActive
                      ? THEME.WHITE_COLOR
                      : pressed
                      ? THEME.WHITE_COLOR
                      : THEME.PRIMARY_COLOR_DARK,
                },
              ]}>
              {title}
            </Text>
            <Text
              style={[
                styles.headerDescription,
                {
                  color:
                    id === isActive
                      ? THEME.WHITE_COLOR
                      : pressed
                      ? THEME.WHITE_COLOR
                      : THEME.PRIMARY_COLOR_DARK,
                },
              ]}>
              {description}
            </Text>
          </View>
          <View style={styles.settingContainer}>
            {iconShow && (
              <MaterialIcons
                color={THEME.DANGER_COLOR}
                size={7}
                name={'circle'}
              />
            )}
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapperCustom: {
    flexDirection: 'row',
    height: 100,
  },
  headerTitle: {
    color: THEME.PRIMARY_COLOR_DARK,
    fontSize: 12,
    fontFamily: FONT.Regular,
    textAlign: 'left',
  },
  headerDescription: {
    color: THEME.PRIMARY_COLOR_DARK,
    fontSize: 14,
    fontFamily: FONT.SemiBold,
    textAlign: 'left',
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
