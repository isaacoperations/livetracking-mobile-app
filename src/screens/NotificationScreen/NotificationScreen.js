import React, {useCallback, useReducer, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  View,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

import {NotificationComponent} from './components/NotificationComponent';
import IconBox from '../../components/icons/IconBox';
import {FONT} from '../../constants/fonts';
import {THEME} from '../../constants/theme';
import reducer, {initialState} from '../../reducer/reducer';
import {createAction} from '../../utils/createAction';
import {localNotificationService} from '../../services/LocalNotificationServices';

export function NotificationScreen({navigation}) {
  const [tempNotify, setTempNotify] = useState([]);
  const [, dispatch] = useReducer(reducer, initialState);

  async function fetchData() {
    await AsyncStorage.getItem('notifyData').then((notify) => {
      if (notify) {
        const dataN = JSON.parse(notify);
        const order = _.orderBy(dataN, ['date'], ['desc']);
        setTempNotify(order);
      } else {
        console.log('notify error');
        setTempNotify([]);
      }
    });
  }

  useFocusEffect(
    useCallback(() => {
      crashlytics().log('Notification Screen mounted.');
      if (Platform.OS === 'ios') {
        messaging()
          .getIsHeadless()
          .then((isHeadless) => {
            // do sth with isHeadless
            console.log('getIsHeadless isHeadless', isHeadless);
          });
      }
      localNotificationService.getApplicationIconBadgeNumber();
      localNotificationService.setApplicationIconBadgeNumber(0);
      (async () => {
        await fetchData();
      })();
      const intervalID2 = setInterval(async () => {
        console.log('intervalID2');
        await AsyncStorage.setItem('notifyIcon', 'false');
        dispatch(createAction('SET_BADGE', false));
        await fetchData();
      }, 1000);
      return () => {
        clearInterval(intervalID2);
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {!_.isEmpty(tempNotify) ? (
          tempNotify.map((item, index) => (
            <NotificationComponent
              key={index}
              title={item.title}
              time={item.date}
              line={item.body}
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
