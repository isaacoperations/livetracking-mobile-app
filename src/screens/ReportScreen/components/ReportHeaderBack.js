import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export function ReportHeaderBack({navigation, text = 'Back to Report'}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ReportScreen')}>
        <View style={styles.containerRow}>
          <MaterialIcons
            name={'keyboard-arrow-left'}
            size={25}
            color={THEME.PRIMARY_COLOR}
          />
          <Text style={styles.text}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.GRAY_COLOR,
    padding: 15,
  },
  text: {
    color: THEME.PRIMARY_COLOR,
    fontFamily: FONT.SemiBold,
    fontSize: 14,
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
