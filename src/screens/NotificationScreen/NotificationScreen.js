import React, {useCallback, useContext, useReducer, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  View,
  Dimensions,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useFocusEffect} from '@react-navigation/native';
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
import {encryptHex} from '../../utils/encrypt';
import {UserContext} from '../../context/context';
import {getDataNotify} from '../../services/NotifyService';

export function NotificationScreen() {
  const user = useContext(UserContext);
  const [tempNotify, setTempNotify] = useState([]);
  const [, dispatch] = useReducer(reducer, initialState);
  const windowHeight = Dimensions.get('window').height;

  async function fetchData() {
    const data = {
      user_id: user.userData.sub,
    };
    const jsonText = JSON.stringify(data);
    const hex = await encryptHex(jsonText);
    await getDataNotify(`/api/history?data=${hex}`)
      .then((messages) => {
        return messages.json();
      })
      .then((resultData) => {
        console.log('getNotifyMessages resultData', resultData.messages);
        setTempNotify(resultData.messages);
      })
      .catch((error) => {
        console.log('error 1', error);
      });
  }

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.removeItem('@reportFilters');
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
        await AsyncStorage.setItem('notifyIcon', 'false');
        dispatch(createAction('SET_BADGE', false));
        await fetchData();
      }, 2000);
      return () => {
        clearInterval(intervalID2);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
              marginTop: windowHeight / 3,
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
    backgroundColor: '#E5E5E5',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PEW_COLOR,
    textAlign: 'center',
  },
});
