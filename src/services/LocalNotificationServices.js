import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalNotificationService {
  constructor() {
    this.lastId = 0;
  }

  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('[LocalNotificationService] onRegister:', token);
      },
      onNotification: async function (notification) {
        console.log('[LocalNotificationService] onNotification:', notification);
        console.log('[LocalNotificationService] test foreground:', notification.foreground);
        await AsyncStorage.setItem('foreground', JSON.stringify(notification.foreground));
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(
          Platform.OS === 'ios' ? notification.data.item : notification.data,
        );

        if (Platform.OS === 'ios') {
          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      // onAction: function (notification) {
      //   console.log('[LocalNotificationService] ACTION:', notification.action);
      //   console.log('[LocalNotificationService] NOTIFICATION ACTION:', notification);
      //   // process the action
      //   onOpenNotification(notification.action);
      // },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
        notificationCenter: true,
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

  unregister = () => {
    PushNotification.unregister();
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      //channelId: options.soundName ? 'sound-channel-id' : 'default-channel-id',
      ticker: options.ticker || 'My Notification Ticker',
      color: options.color || '#0A71CE',
      autoCancel: true,
      largeIcon: options.largeIcon || 'push_icon_72',
      smallIcon: options.smallIcon || 'push_icon_72',
      imageUrl: options.imageUrl || 'push_icon_72',
      bigText: message || 'LiveTracking',
      subText: title || 'LiveTracking message',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high', // (optional) set notification importance, default: high,
      data: data,
      sound: true,
    };
  };

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  showNotification = (title, message, data = {}, options = {}) => {
    this.lastId++;
    PushNotification.localNotification({
      /* Android Only Properties */
      ...this.buildAndroidNotification(
        this.lastId,
        title,
        message,
        data,
        options,
      ),
      /* iOS and Android properties */
      ...this.buildIOSNotification(this.lastId, title, message, data, options),
      /* iOS and Android properties */
      title: title || '',
      message: message || '',
      playSound: options.playSound || true,
      soundName: options.soundName || 'default',
      userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
    });
  };

  getApplicationIconBadgeNumber = () => {
    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      console.log('getApplicationIconBadgeNumber', number);
      if (number > 0) {
        console.log('getApplicationIconBadgeNumberNUMBER', number);
        //PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  };

  setApplicationIconBadgeNumber = (number) => {
    console.log('setApplicationIconBadgeNumber', number);
    PushNotification.setApplicationIconBadgeNumber(number);
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeDeliveredNotificationByID = (notificationId) => {
    console.log(
      '[LocalNotificationService] removeDeliveredNotificationByID: ',
      notificationId,
    );
    PushNotification.cancelLocalNotifications({id: `${notificationId}`});
  };

  popInitialNotification = () => {
    PushNotification.popInitialNotification((notification) => {
      console.log('Initial Notification', notification);
    });
  };

  deleteChannel = () => {
    PushNotification.deleteChannel({
      channelId: 'channel-id',
    })
  };

  createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'fcm_fallback_notification_channel', // (required)
        channelName: 'FCM channel', // (required)
        channelDescription: 'A channel to categorise FCM', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  getChannels = () => {
    PushNotification.getChannels(function (channel_ids) {
      console.log('getChannels', channel_ids); // ['channel_id_1']
    });
  };

  showLocalNotificationSchedule = (
    title,
    message,
    data = {},
    options = {},
    date,
  ) => {
    this.lastId++;
    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      ...this.buildAndroidNotification(
        this.lastId,
        title,
        message,
        data,
        options,
      ),
      /* iOS and Android properties */
      ...this.buildIOSNotification(this.lastId, title, message, data, options),
      /* iOS and Android properties */
      title: title || '',
      message: message || '',
      playSound: options.playSound || true,
      soundName: options.soundName || 'default',
      date: date, // in 60 secs new Date(Date.now() + 60 * 1000)
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      repeatType: 'day',
    });
  };
}

export const localNotificationService = new LocalNotificationService();
