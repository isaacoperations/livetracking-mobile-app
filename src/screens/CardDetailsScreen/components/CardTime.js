import React, {useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

export function CardTime({startTime = null, endTime = null}) {
  useEffect(() => {
    (async () => {
      await MaterialCommunityIcons.loadFont();
    })();
  }, []);
  return (
    <>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View
          style={{
            flex: 1,
            borderRightWidth: 1,
            borderColor: THEME.GRAY_COLOR,
            paddingTop: 20,
            paddingBottom: 30,
          }}>
          <Text style={styles.label}>Start time</Text>
          <View style={styles.timeBlock}>
            <MaterialCommunityIcons
              size={20}
              color={THEME.PRIMARY_COLOR_DARK}
              name={'clock-time-four-outline'}
              style={{marginRight: 10}}
            />
            <Text style={styles.textBlue}>
              {moment(startTime).format('h:mm:ss a')}
            </Text>
          </View>
        </View>
        <View style={{flex: 1, marginLeft: 20, paddingTop: 20}}>
          <Text style={styles.label}>End time</Text>
          <View style={styles.timeBlock}>
            <MaterialCommunityIcons
              size={20}
              color={THEME.PRIMARY_COLOR_DARK}
              name={'clock-time-four-outline'}
              style={{marginRight: 10}}
            />
            <Text style={styles.textBlue}>
              {moment(endTime).format('h:mm:ss a')}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: THEME.PEW_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 17,
    fontFamily: FONT.Medium,
    color: THEME.DARK_COLOR,
    marginBottom: 20,
  },
  timeBlock: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textBlue: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PRIMARY_COLOR_DARK,
    marginBottom: 0,
  },
});
