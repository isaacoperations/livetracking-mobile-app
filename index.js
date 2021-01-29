/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from './src/services/LocalNotificationServices';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  const title = remoteMessage?.twi_title || remoteMessage?.data?.twi_title || remoteMessage?.title;
  const message = remoteMessage?.twi_body || remoteMessage?.data?.twi_body || remoteMessage?.body;
  const options = {
    soundName: 'default',
    playSound: true,
    vibrate: true,
    // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
    // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
  };
  localNotificationService.showNotification(
    title,
    message,
    remoteMessage, //data
    options, //options
  );
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
