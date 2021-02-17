import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AuthContext,
  LiveViewContext,
  UserContext,
  FactoryContext,
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

  useEffect(() => {
    //apnsManager.registerForPushCallback(onRegisterAPNS);
    //apnsManager.showPushCallback(onNotification);

    SplashScreen.hide();

    //localNotificationService.showNotification('title', 'body');

    fcmService.getAPNsToken(onRegisterAPNS);
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

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
      const runID = notify?.twi_action || notify?.data?.twi_action;
      AsyncStorage.setItem('runID', runID);
      localNotificationService.showNotification(
        title,
        message,
        notify, //data
        options, //options
      );
    }
  }

  function onOpenNotification(notify) {
    console.log('[Notification] onOpenNotification: ', notify);
    console.log(
      '[Notification] [Notification][Notification]',
      notify?.data?.twi_title,
      notify?.data?.twi_body,
      notify?.data?.twi_action,
    );
    if (notify) {
      sleep(4000).then(() => {
        const title =
          notify?.twi_title || notify?.data?.twi_title || notify?.title;
        const message =
          notify?.twi_body || notify?.data?.twi_body || notify?.body;
        const runID = notify?.twi_action || notify?.data?.twi_action;
        AsyncStorage.setItem('runID', runID);
        // localNotificationService.showNotification(
        //   title,
        //   message,
        //   notify, //data
        // );
        return Alert.alert(
          title,
          message,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
        // return navigation.push('CardDetail', {
        //   runId: notify?.twi_action || notify?.data?.twi_action,
        // });
      });
    }
    return null;
  }

  if (state.loading) {
    return <SplashScreenComponent />;
  }

  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer>
        {state.user?.token ? (
          <UserContext.Provider value={state?.user}>
            <LiveViewContext.Provider value={state?.line}>
              <FactoryContext.Provider value={state?.factory}>
                <MainTabNavigation />
              </FactoryContext.Provider>
            </LiveViewContext.Provider>
          </UserContext.Provider>
        ) : (
          <AuthStackNavigator />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
