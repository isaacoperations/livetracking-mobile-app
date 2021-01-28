import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
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
          notify?.twi_title || notify.data?.twi_title || notify?.title;
        const message =
          notify?.twi_body || notify.data?.twi_body || notify?.body;
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
          notify, //data
          options, //options
        );
      }
      setNotifyData(notify);
    }

    function onOpenNotification(notify) {
      console.log('[Notification] onOpenNotification: ', notify);
      const title =
        notify?.twi_title || notify.data?.twi_title || notify?.title;
      const message = notify?.twi_body || notify.data?.twi_body || notify?.body;
      sleep(4000);
      Alert.alert(
        title,
        message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }

    SplashScreen.hide();

    return () => {
      console.log('[App], unRegister FCM');
      fcmService.unRegister();
      localNotificationService.unregister();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <SafeAreaProvider>
                <MainTabNavigation />
              </SafeAreaProvider>
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
