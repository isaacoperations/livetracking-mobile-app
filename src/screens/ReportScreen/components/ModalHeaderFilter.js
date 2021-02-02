import React, {useEffect} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';

export function ModalHeaderFilter({title = '', onPress}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <View style={{flexDirection: 'row', height: 50}}>
      <View style={styles.closeContainer}>
        <TouchableOpacity
          onPress={onPress}
          style={styles.close}>
          <MaterialIcons color={THEME.DARK_COLOR} size={20} name={'close'} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
        }}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View
        style={{
          flex: 1,
          borderTopRightRadius: 20,
        }}
      />
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
  close: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
