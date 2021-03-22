import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import moment from 'moment';

import {FONT} from '../constants/fonts';
import {THEME} from '../constants/theme';

export function ProgressContent({
  index,
  title = '',
  percent = 100,
  time = '',
  isActive,
}) {
  const [visible, setVisible] = useState(true);
  const minute = moment().startOf('hour').seconds(time).format('mm');
  const second = moment().startOf('hour').seconds(time).format('ss');
  return (
    <View
      key={index}
      style={[
        styles.progressInfo,
        {
          marginBottom: isActive ? 10 : 0,
          padding: isActive ? 30 : 0,
          paddingBottom: isActive ? 2 : 0,
        },
      ]}>
      <View style={{flex: 1, justifyContent: 'space-between', marginRight: 15}}>
        <Text style={[styles.progressInfoText, styles.uppercase]}>Reason</Text>
        <Text style={[styles.progressInfoText, styles.uppercase]}>
          Lost time
        </Text>
        <Text style={[styles.progressInfoText, styles.uppercase]}>
          Percentage
        </Text>
      </View>
      <View style={{flex: 2, justifyContent: 'space-between'}}>
        <Text
          onPress={() => setVisible(!visible)}
          numberOfLines={visible ? 1 : undefined}
          ellipsizeMode={'tail'}
          style={styles.progressInfoText}>
          {title}
        </Text>
        <Text style={styles.progressInfoText}>{`${minute}m ${second}s`}</Text>
        <Text style={styles.progressInfoText}>{percent} %</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressInfo: {
    flex: 1,
    padding: 30,
    paddingBottom: 2,
    backgroundColor: THEME.PRIMARY_COLOR_DARK,
    flexDirection: 'row',
  },
  progressInfoText: {
    fontFamily: FONT.Regular,
    fontSize: 12,
    color: THEME.WHITE_COLOR,
    marginBottom: 28,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
