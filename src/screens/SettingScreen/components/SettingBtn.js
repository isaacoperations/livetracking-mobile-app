import React, {useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

export function SettingBtn({title = '', onPress}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);

  return (
    <Pressable onPress={onPress}>
      {({pressed}) => (
        <View
          style={[
            styles.row,
            {
              backgroundColor: pressed
                ? THEME.PRIMARY_COLOR_DARK
                : THEME.GRAY_COLOR,
            },
          ]}>
          <Text
            style={[
              styles.title,
              {
                color: pressed ? THEME.WHITE_COLOR : THEME.PRIMARY_COLOR_DARK,
              },
            ]}>
            {title}
          </Text>
          <MaterialIcons
            name={'keyboard-arrow-right'}
            size={15}
            color={pressed ? THEME.WHITE_COLOR : THEME.PRIMARY_COLOR_DARK}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    color: THEME.PRIMARY_COLOR_DARK,
    fontSize: 14,
    fontFamily: FONT.SemiBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 63,
    paddingHorizontal: 30,
  },
});
