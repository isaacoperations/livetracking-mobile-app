import React, {useEffect, useRef, useReducer, useState} from 'react';
import {Alert, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import _ from 'lodash';
import RNBootSplash from 'react-native-bootsplash';
import {
  AuthContext,
  UserContext,
  FactoryContext,
  NotificationContext,
} from './src/context/context';
import {fcmService} from './src/services/FCMServices';
import {localNotificationService} from './src/services/LocalNotificationServices';

import MainTabNavigation from './src/navigation/MainTabNavigation';
import AuthStackNavigator from './src/navigation/AuthStackNavigation';
import OnboardingStackNavigator from './src/navigation/OnboardingStackNavigation';
import {useAuth} from './src/hooks/useAuth';
import {useInterval} from './src/hooks/useInterval';
import {SplashScreenComponent} from './src/components/SplashScreen';
import {sleep} from './src/utils/sleep';

import reducer, {initialState} from './src/reducer/reducer';
import {createAction} from './src/utils/createAction';
import {createTimeSlots} from './src/utils/createTimeSlots';

const App = () => {
  const navigationRef = useRef(null);
  const {auth, state} = useAuth();
  const [, dispatch] = useReducer(reducer, initialState);
  const [isEnable, setIsEnabled] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isEnableDisturb, setIsEnabledDisturb] = useState(false);
  const [isWeek, setIsWeek] = useState(null);
  const [timeSlots, setTimeSlots] = useState(null);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem('onboarding');
      if (value !== null) {
        setIsOnboarding(true);
      } else {
        setIsOnboarding(false);
      }
    } catch (e) {
      console.log('Error onboarding', e);
    }
  };

  useEffect(() => {
    RNBootSplash.hide();
    // localNotificationService.showNotification('title', 'body');

    fcmService.getAPNsToken(onRegisterAPNS);
    fcmService.register(onRegister, onNotification, onOpenNotification);
    // localNotificationService.configure(
    //   onRegister,
    //   onNotification,
    //   onOpenNotification,
    // );
    localNotificationService.createChannel();
    localNotificationService.getChannels();
    fcmService.registerAppWithFCM();

    (async () => {
      await checkOnboarding();
    })();

    return () => {
      console.log('[App], unRegister FCM');
      fcmService.unRegister();
      localNotificationService.unregister();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlots]);

  useInterval(() => {
    (async () => {
      await getFormNotify();
      await checkOnboarding();
    })();
  }, 5000);

  function onRegister(token) {
    AsyncStorage.setItem('tokenDevice', token);
    console.log('[Notification] onRegister: ', token);
  }

  function onRegisterAPNS(token) {
    AsyncStorage.setItem('tokenDeviceAPNs', token);
    console.log('[Notification] onRegister tokenDeviceAPNs: ', token);
  }

  async function onNotification(notify) {
    if (notify) {
      let dataN = [];
      let resultN = [];

      await AsyncStorage.getItem('notifyData').then(async (notifys) => {
        if (notifys) {
          dataN = JSON.parse(notifys);
        }
        let res = {
          title: notify.title || 'Livetracking title',
          body: notify.body || 'Livetracking body',
          date: Math.floor(new Date().getTime() / 1000),
        };
        resultN.push(...dataN, res);
        await AsyncStorage.setItem('notifyData', JSON.stringify(resultN));
      });
    }
    console.log('[Notification] onNotification: ', notify);
    await AsyncStorage.setItem('notifyIcon', 'true');
    dispatch(createAction('SET_BADGE', true));

    if (notify) {
      const title =
        notify?.twi_title || notify?.data?.twi_title || notify?.title;
      const message =
        notify?.twi_body ||
        notify?.data?.twi_body ||
        notify?.body ||
        notify?.message;
      const options = {
        soundName: 'default',
        playSound: true,
        vibrate: true,
        // largeIcon: notify?.icon || notify?.data?.icon || 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
        // smallIcon: notify?.icon || notify?.data?.icon || 'ic_launcher', // add icon small for Android (Link: app/src/main/mipmap)
        // imageUrl: notify?.image || notify?.data?.image || 'ic_launcher', // add icon small for Android (Link: app/src/main/mipmap)
      };
      const date = new Date(Date.now() + 60 * 1000);
      const runID =
        Number(notify?.twi_action) || Number(notify?.data?.twi_action) || null;
      if (isEnable) {
        if (isEnableDisturb) {
          const today = moment().weekday();
          const includeToday = _.includes(isWeek, today);
          const isMinutes = moment().startOf('minute').format('HH:mm');
          const includeMinute = _.includes(timeSlots, isMinutes);
          if (!includeMinute && !includeToday) {
            localNotificationService.showNotification(
              title,
              message,
              notify, //data
              options, //options
            );
          } else {
            console.log('[onNotification] Dont Disturb', isEnableDisturb);
          }
        } else {
          localNotificationService.showNotification(
            title,
            message,
            notify, //data
            options, //options
          );
        }
      } else {
        console.log('disabled in app notify');
      }
    }
  }

  async function getFormNotify() {
    await AsyncStorage.getItem('formNotify', (errs, result) => {
      if (!errs) {
        if (result !== null) {
          const formData = JSON.parse(result);
          const setTimeFrom = moment(formData?.timeFrom, 'HH:mm');
          const setTimeTo = moment(formData?.timeTo, 'HH:mm');
          setIsEnabled(formData?.showInNotify);
          setIsEnabledDisturb(formData?.showInDisturb);
          setIsWeek(formData?.daysIndex);
          setTimeSlots(createTimeSlots(setTimeFrom, setTimeTo));
        }
      }
    });
  }

  async function getForeground(runID, title, message) {
    await AsyncStorage.getItem('foreground').then((item) => {
      const foregroundData = JSON.parse(item);
      if (foregroundData) {
        if (runID > 0) {
          Alert.alert(
            title,
            message,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Navigate to Run Report',
                onPress: () => {
                  return navigationRef.current?.navigate('CardDetail', {
                    runId: runID,
                  });
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          return Alert.alert(
            title,
            message,
            [
              {
                text: 'Ok',
                onPress: () => console.log('Alert close'),
              },
            ],
            {cancelable: false},
          );
        }
      } else {
        if (runID > 0) {
          return navigationRef.current?.navigate('CardDetail', {
            runId: runID,
          });
        } else {
          if (Platform.OS === 'android') {
            return Alert.alert(
              title,
              message,
              [
                {
                  text: 'Ok',
                  onPress: () => console.log('Alert', 'lock'),
                },
              ],
              {cancelable: false},
            );
          } else {
            console.log('Alert IOS', 'push');
          }
        }
      }
    });
  }

  async function onOpenNotification(notify) {
    console.log('[Notification] onOpenNotification: ', notify);
    if (isEnable) {
      if (notify) {
        sleep(1000).then(async () => {
          const title =
            notify?.twi_title || notify?.data?.twi_title || notify?.title;
          const message =
            notify?.twi_body ||
            notify?.data?.twi_body ||
            notify?.body ||
            notify?.message;
          const runID =
            Number(notify?.twi_action) ||
            Number(notify?.data?.twi_action) ||
            null;

          const options = {
            soundName: 'default',
            playSound: true,
            vibrate: true,
            // largeIcon: notify?.icon || notify?.data?.icon || 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
            // smallIcon: notify?.icon || notify?.data?.icon || 'ic_launcher', // add icon small for Android (Link: app/src/main/mipmap)
            // imageUrl: notify?.image || notify?.data?.image || 'ic_launcher', // add icon small for Android (Link: app/src/main/mipmap)
          };
          if (isEnableDisturb) {
            const today = moment().weekday();
            const includeToday = _.includes(isWeek, today);
            const isMinutes = moment().startOf('minute').format('HH:mm');
            const includeMinute = _.includes(timeSlots, isMinutes);
            if (!includeMinute && !includeToday) {
              await getForeground(runID, title, message);
            } else {
              console.log('[onOpenNotification] dont Disturb');
            }
          } else {
            await getForeground(runID, title, message);
          }
        });
      }
    } else {
      console.log('[Notification] disabled in App');
    }
  }

  if (state.loading) {
    return <SplashScreenComponent />;
  }

  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer ref={navigationRef}>
        {state.user?.token ? (
          <UserContext.Provider value={state.user}>
            <FactoryContext.Provider value={state.factory}>
              <NotificationContext.Provider value={state.badge}>
                {!isOnboarding ? (
                  <OnboardingStackNavigator />
                ) : (
                  <MainTabNavigation />
                )}
                <Toast ref={(ref) => Toast.setRef(ref)} />
              </NotificationContext.Provider>
            </FactoryContext.Provider>
          </UserContext.Provider>
        ) : (
          <>
            <AuthStackNavigator />
            <Toast ref={(ref) => Toast.setRef(ref)} />
          </>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
