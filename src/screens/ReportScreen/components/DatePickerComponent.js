import * as React from 'react';
import {Platform, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

function DatePickerComponent({title = 'Date', date, onPress}) {
  return (
    <TouchableOpacity style={styles.timeBlock} onPress={onPress} activeOpacity={0.8}>
      <MaterialCommunityIcons
        size={25}
        name="calendar-blank-outline"
        color={THEME.CHAR_COLOR}
        style={styles.calendar}
      />
      <View style={{marginLeft: 10}}>
        <Text style={[styles.title, styles.uppercase]}>{title}</Text>
        <Text style={styles.date}>
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default DatePickerComponent;

const styles = StyleSheet.create({
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: THEME.ASH_2_COLOR,
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  date: {
    color: THEME.PRIMARY_COLOR,
    fontSize: 15,
    fontFamily: FONT.Regular,
  },
  title: {
    color: THEME.CHAR_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  calendar: {
    marginBottom: Platform.OS === 'android' ? 4 : 0,
  },
});
