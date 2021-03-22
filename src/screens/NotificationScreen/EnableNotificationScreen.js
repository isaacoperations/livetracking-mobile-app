import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import * as Animatable from 'react-native-animatable';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import {Btn} from '../../components/Button';
import LogoNotification from '../../components/icons/LogoNotification';

export function EnableNotificationScreen({navigation}) {
  const [isShow, setIsShow] = useState(true);
  useFocusEffect(
    useCallback(() => {
      crashlytics().log('Enable Notification - Screen');
      requestUserPermission();
      const intervalID = setInterval(async () => {
        await requestUserPermission();
      }, 2000);

      return () => clearInterval(intervalID);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShow]),
  );

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      setIsShow(false);
      console.log('Authorization status:', authStatus);
    } else {
      setIsShow(true);
      console.log('Authorization status:', authStatus);
    }
  }

  const handlePress = async () => {
    Alert.alert(
      '“LiveTracking” Would Like to Send You Notifications"',
      'Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.',
      [
        {
          text: 'Don’t Allow',
          onPress: async () => {
            crashlytics().log('Enable Notification - Don’t Allow');
            await AsyncStorage.setItem('onboarding', 'true')
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            crashlytics().log('Enable Notification - Enable button');
            await AsyncStorage.setItem('onboarding', 'true');
            await Linking.openSettings();
          },
        },
      ],
    );
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
      {Platform.OS === 'ios' ? (
        isShow ? (
          <>
            <Pressable
              onPress={handlePress}
              style={({pressed}) => [
                {
                  backgroundColor: pressed
                    ? THEME.PRIMARY_COLOR_DARK
                    : THEME.PRIMARY_COLOR,
                  borderColor: THEME.WHITE_COLOR,
                },
                THEME.BUTTON_PRIMARY_SMALL,
              ]}>
              <View style={styles.centered}>
                <Text style={[{color: THEME.WHITE_COLOR}, styles.text]}>
                  Enable Notification
                </Text>
              </View>
            </Pressable>
            <Btn
              navigation={navigation}
              title={'I’ll do it later'}
              onPress={async () => {
                crashlytics().log('Enable Notification - I’ll do it later');
                await AsyncStorage.setItem('onboarding', 'true');
              }}
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
            title={'Go home'}
            onPress={async () => {
              crashlytics().log('Enable Notification - Go home');
              await AsyncStorage.setItem('onboarding', 'true');
            }}
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
        )
      ) : (
        <>
          <Pressable
            onPress={handlePress}
            style={({pressed}) => [
              {
                backgroundColor: pressed
                  ? THEME.PRIMARY_COLOR_DARK
                  : THEME.PRIMARY_COLOR,
                borderColor: THEME.WHITE_COLOR,
              },
              THEME.BUTTON_PRIMARY_SMALL,
            ]}>
            <View style={styles.centered}>
              <Text style={[{color: THEME.WHITE_COLOR}, styles.text]}>
                Enable Notification
              </Text>
            </View>
          </Pressable>
          <Btn
            navigation={navigation}
            title={'I’ll do it later'}
            onPress={async () => {
              crashlytics().log('Enable Notification - I’ll do it later');
              await AsyncStorage.setItem('onboarding', 'true');
            }}
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
  centered: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
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
