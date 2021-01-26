import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {Alert} from 'react-native';

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

import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  //const navigation = useNavigation();
  const {auth, state} = useAuth();
  const [notifyData, setNotifyData] = useState({});

  function onRegister(token) {
    AsyncStorage.setItem('tokenDevice', token);
    console.log('[Notification] onRegister: ', token);
  }

  function onNotification(notify) {
    console.log('[Notification] onNotification : ', notify);
    console.log('[Notification] onNotification message: ', notify?.message);
    const title = notify?.title || 'LiveTracking';
    const message = notify?.body || notify?.message;
    const options = {
      soundName: 'default',
      playSound: true,
      vibrate: true,
    };
    localNotificationService.showNotification(
      title,
      message,
      notify, //data
      options, //options
    );
    setNotifyData(notify);
  }

  function onOpenNotification(notify) {
    console.log('[Notification] onOpenNotification  : ', notify);
    // if (notify.message) {
    //   const title = notify?.title || 'LiveTracking';
    //   const message = notify?.body || notify?.message;
    //   localNotificationService.showNotification(
    //     title,
    //     message,
    //     notify, //data
    //   );
    // }
  }

  const onPressSendNotification = () => {
    console.log('START onPressSendNotification');
    localNotificationService.showNotification(
      'App Notification',
      'local Notification',
      {}, //data
    );
  };

  useEffect(() => {
    console.log('user state app', state?.user);

    //fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    //onPressSendNotification();

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
