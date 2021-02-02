import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AuthContext,
  UserContext,
  NotificationContext,
} from './src/context/context';

import {fcmService} from './src/services/FCMServices';
import {localNotificationService} from './src/services/LocalNotificationServices';

import MainTabNavigation from './src/navigation/MainTabNavigation';
import AuthStackNavigator from './src/navigation/AuthStackNavigation';
import {useAuth} from './src/hooks/useAuth';
import {SplashScreenComponent} from './src/components/SplashScreen';
import {sleep} from './src/utils/sleep';

const App = () => {
  const {auth, state} = useAuth();
  const [notifyData, setNotifyData] = useState({});

  useEffect(() => {
    console.log('user state app', state?.user);

    //fcmService.registerAppWithFCM();
    fcmService.getAPNsToken(onRegisterAPNS);
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    onNotification();
    onOpenNotification();

    SplashScreen.hide();

    return () => {
      console.log('[App], unRegister FCM');
      fcmService.unRegister();
      localNotificationService.unregister();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onRegister(token) {
    AsyncStorage.setItem('tokenDevice', token);
    console.log('[Notification] onRegister: ', token);
  }

  function onRegisterAPNS(token) {
    AsyncStorage.setItem('tokenDeviceAPNs', token);
    console.log('[Notification] onRegister tokenDeviceAPNs: ', token);
  }

  function onNotification(notify) {
    console.log('[Notification] onNotification: ', notify);
    if (notify) {
      const title =
        notify?.twi_title || notify?.data?.twi_title || notify?.title;
      const message =
        notify?.twi_body || notify?.data?.twi_body || notify?.body;
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
    setNotifyData(notify);
  }

  function onOpenNotification(notify) {
    console.log('[Notification] onOpenNotification: ', notify);
    if (!state.loading) {
      console.log(
        '[Notification] [Notification][Notification]',
        notify?.data?.twi_title,
        notify?.data?.twi_body,
      );
      if (notify) {
        sleep(4000).then(() => {
          const title =
            notify?.twi_title || notify?.data?.twi_title || notify?.title;
          const message =
            notify?.twi_body || notify?.data?.twi_body || notify?.body;
          localNotificationService.showNotification(
            title,
            message,
            notify, //data
          );
          // return Alert.alert(
          //   title,
          //   message,
          //   [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          //   {cancelable: false},
          // );
        });
      }
      setNotifyData(notify);
    }
  }

  if (state.user?.token) {
    console.log('access user token');
  } else {
    console.log('not user token');
  }

  if (state.loading) {
    return <SplashScreenComponent />;
  }

  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer>
        {state.user?.token ? (
          <UserContext.Provider value={state?.user}>
            <NotificationContext.Provider value={notifyData}>
              <MainTabNavigation />
            </NotificationContext.Provider>
          </UserContext.Provider>
        ) : (
          <AuthStackNavigator />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
