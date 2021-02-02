import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {localNotificationService} from './LocalNotificationServices';

class ApnsSupport {
  static registerForPushCallback(log, client) {
    console.log(
      'ApnsSupportModule.JS.registerForPushCallback',
      'requesting APN token',
    );

    PushNotificationIOS.addEventListener('register', function (token) {
      console.log(
        'ApnsSupportModule.JS.registerForPushCallback',
        'got new APN token',
        token,
      );
      client.setPushRegistrationId('apn', token);
    });

    PushNotificationIOS.addEventListener('registrationError', function (err) {
      console.error(
        'ApnsSupportModule.JS.registerForPushCallback',
        'error registering for notifications',
        err,
      );
    });

    PushNotificationIOS.addEventListener(
      'notification',
      function (notification) {
        // TODO: here we need to pass the full `raw` notification to the Chat
        // library. however, I couldn't find the way to get the raw json from APN
        // notification in react native, so, I had to construct the payload again.
        // Send in PRs if you know the right way :)
        //localNotificationService.showNotification()
        console.log(
          'ApnsSupportModule.JS.registerForPushCallback',
          'got new APN push event',
          notification,
        );
        let rawNotification: Object = Object.assign(notification._data);
        if (!rawNotification.aps) {
          rawNotification.aps = {};
        }

        rawNotification.aps.alert = notification._alert;
        if (typeof notification._badgeCount !== 'undefined') {
          PushNotificationIOS.setApplicationIconBadgeNumber(
            notification._badgeCount,
          );
          rawNotification.aps.badge = notification._badgeCount;
        }
        if (typeof notification._sound !== 'undefined') {
          rawNotification.aps.sound = notification._sound;
        }
        console.log(
          'ApnsSupportModule.JS.registerForPushCallback',
          'formed RAW notification',
          rawNotification,
        );
        client.handlePushNotification(rawNotification);
      },
    );

    PushNotificationIOS.requestPermissions()
      .then((permissions) => {
        console.log(
          'ApnsSupportModule.JS.registerForPushCallback',
          'successfully requested permissions',
          permissions,
        );
      })
      .catch((err) => {
        console.log(
          'ApnsSupportModule.JS.registerForPushCallback',
          'error while requesting permissions',
          err,
        );
      });
  }

  static showPushCallback(log, push) {
    log.info(
      'ApnsSupportModule.JS.showPushCallback',
      'show notification',
      push,
    );
    //AlertIOS.alert(push.messageType, push.body);
    const title = push.messageType;
    const message = push.body;
    const notify = push;
    const options = {
      soundName: 'default',
      playSound: true,
      vibrate: true,
      // largeIcon: notify?.icon || notify?.data?.icon || 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
      // smallIcon: notify?.icon || notify?.data?.icon || 'ic_launcher', // add icon small for Android (Link: app/src/main/mipmap)
      // imageUrl: notify?.image || notify?.data?.image || 'ic_launcher', // add icon small for Android (Link: app/src/main/mipmap)
    };
    localNotificationService.showNotification(
      title,
      message,
      notify, //data
      options, //options
    );
  }
}

const apnsManager = new ApnsSupport();
