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
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  if (remoteMessage) {
    await AsyncStorage.setItem('notifyIcon', 'true');
    const title =
      remoteMessage?.data?.twi_title ||
      remoteMessage?.twi_title ||
      remoteMessage?.title;
    const message =
      remoteMessage?.data?.twi_body ||
      remoteMessage?.twi_body ||
      remoteMessage?.body;
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
    localNotificationService.showNotification(
      title,
      message,
      remoteMessage, // data
      options, // options
    );
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
