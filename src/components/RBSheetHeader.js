import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FONT} from '../constants/fonts';

export function RBSheetHeader({
  title = 'Edit list',
  onPress,
  iconName,
  iconSize = 20,
}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        width: '100%',
        height: 56,
      }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: iconSize,
          height: iconSize,
        }}>
        <MaterialIcons name={iconName} size={iconSize} color={'black'} />
      </TouchableOpacity>
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 17, fontFamily: FONT.Medium, color: 'black'}}>
          {title}
        </Text>
      </View>
      <View style={{flex: 1}} />
    </View>
  );
}
