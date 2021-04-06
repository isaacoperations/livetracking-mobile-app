import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {localNotificationService} from './LocalNotificationServices';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async (onNotification, onOpenNotification) => {
    console.log(
      'isDeviceRegisteredForRemoteMessages',
      messaging().isDeviceRegisteredForRemoteMessages,
      messaging().isAutoInitEnabled,
    );
    if (Platform.OS === 'ios') {
      await messaging()
        .registerDeviceForRemoteMessages()
        .then((register) => {
          console.log('registerDeviceForRemoteMessages', register);
        });
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = async (onRegister) => {
    await messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          // User has permissions
          this.getToken(onRegister);
          this.getAPNsToken(onRegister);
        } else {
          // User doesn't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };

  getToken = async (onRegister) => {
    await messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch((error) => {
        console.log('[FCMService] getToken rejected ', error);
      });
  };

  getAPNsToken = async (onRegisterAPNS) => {
    await messaging()
      .getAPNSToken()
      .then((fcmToken) => {
        if (fcmToken) {
          console.log('[FCMService] getAPNSToken ', fcmToken);
          onRegisterAPNS(fcmToken);
        } else {
          console.log('[FCMService] User does not have a device apn token');
        }
      })
      .catch((error) => {
        console.log('[FCMService] getToken rejected ', error);
      });
  };

  requestPermission = async (onRegister) => {
    await messaging()
      .requestPermission({
        announcement: true,
        provisional: true,
      })
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log('[FCMService] Request Permission rejected ', error);
      });
  };

  deleteToken = async () => {
    console.log('[FCMService] deleteToken ');
    await messaging()
      .deleteToken()
      .catch((error) => {
        console.log('[FCMService] Delete token error ', error);
      });
  };

  createNotificationListeners = async (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // When the application is running, but in the background
    await messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        '[FCMService] onNotificationOpenedApp Notification caused app to open from background state:',
        remoteMessage,
      );
      if (remoteMessage) {
        console.log('[FCMService] onNotificationOpenedApp:', remoteMessage);
        localNotificationService.setApplicationIconBadgeNumber(1);
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
        // this.removeDeliveredNotification(notification.notificationId)
      }
    });

    // When the application is opened from a quit state.
    await messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(
          '[FCMService] getInitialNotification Notification caused app to open from quit state:',
          remoteMessage,
        );

        if (remoteMessage) {
          localNotificationService.setApplicationIconBadgeNumber(1);
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
          //  this.removeDeliveredNotification(notification.notificationId)
        }
      });

    // Foreground state messages
    this.messageListener = await messaging().onMessage(
      async (remoteMessage) => {
        console.log('[FCMService] A new FCM message arrived!', remoteMessage);
        if (remoteMessage) {
          localNotificationService.setApplicationIconBadgeNumber(1);
          console.log('notification', remoteMessage);
          let notification = null;
          if (Platform.OS === 'ios') {
            notification = remoteMessage.notification;
          } else {
            notification = remoteMessage.notification; // data
          }
          onNotification(notification);
          onOpenNotification(notification);
        }
      },
    );

    // Triggered when have new token
    await messaging().onTokenRefresh((fcmToken) => {
      console.log('[FCMService] New token refresh: ', fcmToken);
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}

export const fcmService = new FCMService();
