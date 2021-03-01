import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Divider} from 'react-native-elements';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import HeaderStatus from '../../components/HeaderStatus';
import {DownTimeComponent} from './components/DownTimeComponent';

export function DownTimeScreen() {
  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <View>
            <View style={styles.block}>
              <Text style={styles.label}>Downtime Reason</Text>
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                Changeover
              </Text>
              <Text style={styles.label}>Time Lost</Text>
              <Text style={styles.text}>1:48:22</Text>
            </View>
            <DownTimeComponent
              title={'Ippolito DXM Node 3'}
              subTitle={'Blueberry Muffins '}
              time={'1:22:01'}
              percent={100}
            />
            <Divider style={styles.divider} />
            <DownTimeComponent
              title={'Ippolito DXM Node 3'}
              subTitle={'Blueberry Muffins '}
              time={'0:24:32'}
              percent={50}
            />
            <Divider style={styles.divider} />
            <DownTimeComponent
              title={'Ippolito DXM Node 3'}
              subTitle={'Blueberry Muffins '}
              time={'0:01:49'}
              percent={20}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    height: '100%',
  },
  block: {
    position: 'relative',
    backgroundColor: THEME.WHITE_COLOR,
    padding: 30,
    paddingBottom: 0,
    borderColor: THEME.ASH_COLOR,
    marginBottom: 10,
  },
  label: {
    color: THEME.PEW_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    marginBottom: 5,
  },
  text: {
    fontSize: 17,
    fontFamily: FONT.Medium,
    color: THEME.DARK_COLOR,
    marginBottom: 20,
  },
  divider: {
    backgroundColor: THEME.GRAY_COLOR,
    marginLeft: -30,
    marginRight: -30,
  },
});
