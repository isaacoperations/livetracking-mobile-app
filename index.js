/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from './src/services/LocalNotificationServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Register background handler
AsyncStorage.removeItem('@reportFilters');
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  if (remoteMessage) {
    console.log('remoteMessage', remoteMessage);
    let data = [];
    let result = [];
    await AsyncStorage.setItem('notifyIcon', 'true');

    await AsyncStorage.getItem('notifyData').then(async (notify) => {
      if (notify) {
        data = JSON.parse(notify);
      }
      let res = {
        title: remoteMessage.notification.title || remoteMessage.data.title,
        body: remoteMessage.notification.body || remoteMessage.data.body,
        date: Math.floor(new Date().getTime() / 1000),
      };
      result.push(...data, res);
      await AsyncStorage.setItem('notifyData', JSON.stringify(result));
    });

    const title =
      remoteMessage?.data?.twi_title ||
      remoteMessage?.twi_title ||
      remoteMessage?.title ||
      remoteMessage.notification.title;
    const message =
      remoteMessage?.data?.twi_body ||
      remoteMessage?.twi_body ||
      remoteMessage?.body ||
      remoteMessage.notification.body;
    const options = {
      soundName: 'default',
      playSound: true,
      vibrate: true,
      // largeIcon:
      //   remoteMessage?.icon || remoteMessage?.data?.icon || 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
      // smallIcon:
      //   remoteMessage?.icon || remoteMessage?.data?.icon || 'ic_launcher', // add icon small for Android (Link: app/src/main/mipmap)
      // imageUrl:
      //   remoteMessage?.image || remoteMessage?.data?.image || 'ic_launcher', // add icon small for Android (Link: app/src/main/mipmap)
    };
    // localNotificationService.showNotification(
    //   title,
    //   message,
    //   remoteMessage, // data
    //   options, // options
    // );
  }
});

/**
 * @return {null}
 */
function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    console.log('isHeadless', isHeadless);
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
