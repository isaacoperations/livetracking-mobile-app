import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  View,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {NotificationComponent} from './components/NotificationComponent';
import IconBox from '../../components/icons/IconBox';
import {FONT} from '../../constants/fonts';
import {THEME} from '../../constants/theme';

const data = [
  {
    id: 1,
    title: 'Notification title 1',
    status: 'Downtime',
    time: 'now',
    line: 'Line 1',
    sku: 'SKU 229394, SKU 234823',
  },
  {
    id: 2,
    title: 'Notification title 2',
    status: 'RUN start',
    time: '2d',
    line: 'Line 2',
    sku: 'SKU 229394, SKU 234823',
  },
  {
    id: 3,
    title: 'Notification title 3',
    status: 'Downtime',
    time: 'now',
    line: 'Line 3',
    sku: 'SKU 229394, SKU 234823',
  },
  {
    id: 4,
    title: 'Notification title 4',
    status: 'Downtime',
    time: 'now',
    line: 'Line 4',
    sku: 'SKU 229394, SKU 234823',
  },
  {
    id: 5,
    title: 'Notification title 5',
    status: 'Downtime',
    time: 'now',
    line: 'Line 5',
    sku: 'SKU 229394, SKU 234823',
  },
  {
    id: 6,
    title: 'Notification title 6',
    status: 'Downtime',
    time: 'now',
    line: 'Line 6',
    sku: 'SKU 229394, SKU 234823',
  },
  {
    id: 7,
    title: 'Notification title 7',
    status: 'Downtime',
    time: 'now',
    line: 'Line 7',
    sku: 'SKU 229394, SKU 234823',
  },
  {
    id: 8,
    title: 'Notification title 8',
    status: 'Downtime',
    time: 'now',
    line: 'Line 8',
    sku: 'SKU 229394, SKU 234823',
  },
  {
    id: 9,
    title: 'Notification title 9',
    status: 'Downtime',
    time: '9d',
    line: 'Line 9',
    sku: 'SKU 229394, SKU 234823',
  },
  {
    id: 10,
    title: 'Notification title 10',
    status: 'Downtime',
    time: '10d',
    line: 'Line 10',
    sku: 'SKU 229394, SKU 234823',
  },
];

export function NotificationScreen() {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      messaging()
        .getIsHeadless()
        .then((isHeadless) => {
          // do sth with isHeadless
          console.log('getIsHeadless isHeadless', isHeadless);
        });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {data.length > 0 ? (
          data?.map((item) => (
            <NotificationComponent
              key={item.id}
              title={item.title}
              sku={item.sku}
              time={item.time}
              status={item.status}
              line={item.line}
            />
          ))
        ) : (
          <View
            style={{
              marginTop: 300,
              marginBottom: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconBox style={{marginBottom: 15}} />
            <Text style={styles.subtitle}>
              You have no data in your watch list
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PEW_COLOR,
    textAlign: 'center',
  },
});
