import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class NotificationManager {
  configure = (onRegister, onNotification, onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        if (Platform.OS === 'ios') {
          if (notification.data.foreground) {
            notification.userInteraction = true;
          }
        } else {
          notification.userInteraction = true;
        }

        if (notification.userInteraction) {
          onOpenNotification(notification);
        } else {
          onNotification(notification);
        }

        // Only call callback if not from foreground
        if (Platform.OS === 'ios') {
          if (!notification.data.foreground) {
            notification.finish('backgroundFetchResultNoData');
          }

          notification.finish(PushNotificationIOS.FetchResult.NoData);
        } else {
          notification.finish('backgroundFetchResultNoData');
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  _buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || false,
      vibration: options.vibration || '300',
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };

  _buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      ...this._buildAndroidNotification(id, title, message, data, options),
      /* IOS Only Properties */
      ...this._buildIOSNotification(id, title, message, data, options),
      /* IOS and Android Properties */
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false, // if the notification was opened by the user from notification area or not
    });
  };

  cancelAllLocalNotification = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  unregister = () => {
    PushNotification.unregister;
  };
}

export const notificationManager = new NotificationManager();
