import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';

export function ReportHeaderInfo({navigation, runData = [], filtersData}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => console.log('downtime')}
        activeOpacity={1}>
        <Text style={styles.textLeft}>
          {_.size(runData)} Runs found
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('RunLog', {
            logData: runData,
            filterData: filtersData
          })
        }
        style={{flexDirection: 'row', alignItems: 'center'}}
        activeOpacity={0.8}>
        <Text style={styles.textRight}>View Run Log</Text>
        <MaterialIcons
          size={14}
          color={THEME.PRIMARY_COLOR}
          name={'arrow-forward-ios'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.GRAY_COLOR,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 23,
    paddingHorizontal: 30,
  },
  textLeft: {
    fontSize: 12,
    fontFamily: FONT.Regular,
    color: THEME.PRIMARY_COLOR,
    textTransform: 'uppercase',
  },
  textRight: {
    fontFamily: FONT.SemiBold,
    color: THEME.PRIMARY_COLOR,
    fontSize: 14,
    marginRight: 10,
  },
});
