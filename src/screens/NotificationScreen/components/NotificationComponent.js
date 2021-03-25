import React from 'react';
import moment from 'moment';
import {StyleSheet, Text, View} from 'react-native';
import {Divider} from 'react-native-elements';
import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'now',
    ss: '%d s',
    m: 'now',
    mm: '%d m',
    h: '%d h',
    hh: '%d h',
    d: 'a d',
    dd: '%d d',
    w: '%d w',
    ww: '%d w',
    M: '%d m',
    MM: '%d m',
    y: '%d y',
    yy: '%d y',
  },
});

export function NotificationComponent({
  title = 'Notification title',
  status = 'Downtime',
  time = 'now',
  line = 'Line 1',
  sku = 'SKU 229394, SKU 234823',
}) {
  console.log(time);
  return (
    <>
      <View style={styles.block}>
        <View style={styles.flexBetween}>
          <Text style={styles.status}>{status}</Text>
          <Text style={styles.line}>{moment.unix(time).fromNow(true)}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.line}>{line}</Text>
        <Text style={styles.sku}>{sku}</Text>
      </View>
      <Divider style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: THEME.WHITE_COLOR,
  },
  flexBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    marginBottom: 5,
    fontSize: 12,
    fontFamily: FONT.Regular,
    textTransform: 'uppercase',
    color: THEME.DARK_COLOR,
  },
  title: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.DARK_COLOR,
    marginBottom: 1,
  },
  line: {
    fontSize: 12,
    fontFamily: FONT.Regular,
    color: THEME.PEW_COLOR,
    marginBottom: 5,
  },
  sku: {
    fontSize: 12,
    fontFamily: FONT.Regular,
    color: THEME.PEW_COLOR,
    textTransform: 'uppercase',
  },
  divider: {
    backgroundColor: THEME.GRAY_COLOR,
    marginLeft: -20,
    marginRight: -20,
  },
});
