import React, {useEffect} from 'react';
import {Text, StyleSheet, View, Platform} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';
import IconCheck from '../../../components/icons/IconCheck';

export function CardTime({startTime = null, endTime = null}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
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
          <MaterialIcons
            size={25}
            color={THEME.PRIMARY_COLOR_DARK}
            name={'access-time'}
            style={{marginRight: 10}}
          />
          <Text style={styles.textBlue}>
            {startTime ? moment.utc(startTime).format('LTS') : 'In Progress'}
          </Text>
        </View>
      </View>
      <View style={{flex: 1, marginLeft: 20, paddingTop: 20}}>
        <Text style={styles.label}>End time</Text>
        {Platform.OS === 'ios' ? (
          <View style={[styles.timeBlock, {marginTop: 12}]}>
            <IconCheck />
            <View style={{marginLeft: 15}}>
              <Text style={styles.textBlue}>
                {endTime ? moment.utc(endTime).format('LTS') : 'In Progress'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.timeBlock}>
            <IconCheck />
            <View style={{marginLeft: 15}}>
              <Text style={styles.textBlue}>
                {endTime ? moment.utc(endTime).format('LTS') : 'In Progress'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
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
    alignItems: 'center',
  },
  textBlue: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PRIMARY_COLOR_DARK,
    marginBottom: 0,
  },
  textTop: {
    position: 'absolute',
    top: -11,
    fontSize: 12,
  },
});
