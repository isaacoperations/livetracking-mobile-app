import * as React from 'react';
import {View, Text, StyleSheet, Pressable, Platform} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {THEME} from '../constants/theme';
import {FONT} from '../constants/fonts';
import {useEffect} from 'react';

export function Btn({
  title,
  icon = true,
  iconColor = THEME.PRIMARY_COLOR,
  iconColorHover = THEME.WHITE_COLOR,
  borderColor = THEME.PRIMARY_COLOR,
  backgroundColor = THEME.WHITE_COLOR,
  backgroundColorHover = THEME.PRIMARY_COLOR,
  textColor = THEME.PRIMARY_COLOR,
  textColorHover = THEME.PRIMARY_COLOR,
  fontFamily = Platform.OS === 'ios' ? FONT.SemiBold : FONT.Bold,
  size = THEME.BUTTON_PRIMARY_BIG,
  onPress,
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
          backgroundColor: !pressed ? backgroundColor : backgroundColorHover,
          borderColor: borderColor,
        },
        size,
      ]}>
      {({pressed}) => (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            flexDirection: 'row',
          }}>
          <Text
            style={[
              {
                color: !pressed ? textColor : textColorHover,
                fontFamily: fontFamily,
              },
              styles.text,
            ]}>
            {title}
          </Text>
          {icon && (
            <MaterialIcons
              style={{color: !pressed ? iconColor : iconColorHover}}
              name="arrow-forward-ios"
              size={14}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
  },
});
