import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import {Btn} from '../../components/Button';
import LogoNotification from '../../components/icons/LogoNotification';

import {fcmService} from '../../services/FCMServices';

export function EnableNotificationScreen({navigation}) {
  const [isShow, setIsShow] = useState(true);
  useEffect(() => {
    fcmService.checkPermission(onRegister);
  }, []);

  async function onRegister(token) {
    if (token) {
      console.log('[Notification] [checkPermission] onRegister: ', token);
      setIsShow(false);
    } else {
      setIsShow(true);
      await AsyncStorage.setItem('tokenDevice', token);
      console.log('[Notification] [checkPermission] not onRegister: ', token);
    }
  }
  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //     setIsShow(false);
  //   } else {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  const handleSubmit = async () => {
    // Alert.alert(
    //   '“LiveTracking” Would Like to Send You Notifications"',
    //   'Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.',
    //   [
    //     {
    //       text: 'Don’t Allow',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {text: 'OK', onPress: () => navigation.navigate('Authentication')},
    //   ],
    // );
    await onRegister();
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        duration={800}
        animation={'bounceIn'}
        style={{marginBottom: 60}}>
        <LogoNotification />
      </Animatable.View>
      <View>
        <Text style={styles.title}>Enable Notification</Text>
        <Text style={styles.subtitle}>
          Turn on In-App Notification allows your phone to notify you as soon as
          your subscribed notifications are triggered.
        </Text>
      </View>
      {isShow && isShow ? (
        <>
          <Pressable
            onPress={handleSubmit}
            style={({pressed}) => [
              {
                backgroundColor: pressed
                  ? THEME.PRIMARY_COLOR_DARK
                  : THEME.PRIMARY_COLOR,
                borderColor: THEME.WHITE_COLOR,
              },
              THEME.BUTTON_PRIMARY_SMALL,
            ]}>
            {({pressed}) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  flexDirection: 'row',
                }}>
                <Text style={[{color: THEME.WHITE_COLOR}, styles.text]}>
                  Enable Notification
                </Text>
              </View>
            )}
          </Pressable>
          <Btn
            navigation={navigation}
            title={'I’ll do it later'}
            onPress={() => navigation.navigate('AuthInfo')}
            borderColor={THEME.PRIMARY_COLOR}
            backgroundColor={THEME.WHITE_COLOR}
            backgroundColorHover={THEME.PRIMARY_COLOR}
            textColor={THEME.PRIMARY_COLOR}
            textColorHover={THEME.WHITE_COLOR}
            icon={false}
            iconColor={THEME.PRIMARY_COLOR}
            iconColorHover={THEME.WHITE_COLOR}
            size={THEME.BUTTON_PRIMARY_SMALL}
          />
        </>
      ) : (
        <Btn
          navigation={navigation}
          title={'Go to login page'}
          onPress={() => navigation.navigate('Login')}
          borderColor={THEME.PRIMARY_COLOR}
          backgroundColor={THEME.WHITE_COLOR}
          backgroundColorHover={THEME.PRIMARY_COLOR}
          textColor={THEME.PRIMARY_COLOR}
          textColorHover={THEME.WHITE_COLOR}
          icon={false}
          iconColor={THEME.PRIMARY_COLOR}
          iconColorHover={THEME.WHITE_COLOR}
          size={THEME.BUTTON_PRIMARY_SMALL}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F1F1F1',
  },
  text: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    fontFamily: FONT.SemiBold,
  },
  title: {
    fontSize: 22,
    fontFamily: FONT.SemiBold,
    color: THEME.PRIMARY_COLOR_DARK,
    marginBottom: 26,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.DARK_COLOR,
    textAlign: 'center',
    marginBottom: 103,
  },
});
