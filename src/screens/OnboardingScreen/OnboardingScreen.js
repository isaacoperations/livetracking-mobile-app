import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import * as Animatable from 'react-native-animatable';
import {useFocusEffect} from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {IMAGE} from '../../constants/images';
import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';
import Onboarding1 from './components/OnBoarding_1';
import Onboarding2 from './components/OnBoarding_2';
import Onboarding3 from './components/OnBoarding_3';
import Onboarding4 from './components/OnBoarding_4';
import SvgOnBoarding from '../../images/onboarding/SvgOnBording_1';
import SvgOnBoarding2 from '../../images/onboarding/SvgOnBording_2';
import SvgOnBoarding4 from '../../images/onboarding/SvgOnBording_4';

export function OnboardingScreen({navigation}) {
  const [page, setPage] = useState(0);
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

  const skipBtn = ({...props}) => (
    <TouchableOpacity {...props}>
      <Text style={[THEME.TEXT, styles.skip]}>Skip</Text>
    </TouchableOpacity>
  );
  const NextBtn = ({...props}) => (
    <TouchableOpacity {...props}>
      <Text style={[THEME.TEXT, styles.next]}>Next</Text>
    </TouchableOpacity>
  );
  const DoneBtn = ({...props}) => (
    <TouchableOpacity {...props}>
      <Text style={[THEME.TEXT, styles.done]}>Done</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {page === 0 && (
        <View style={styles.headerIcon}>
          <Animatable.View duration={800} animation={'bounceIn'}>
            <Onboarding1 />
          </Animatable.View>
        </View>
      )}
      {page === 1 && (
        <View style={styles.headerIcon}>
          <Animatable.View duration={800} animation={'bounceIn'}>
            <Onboarding2 />
          </Animatable.View>
        </View>
      )}
      {page === 2 && (
        <View style={styles.headerIcon}>
          <Animatable.View duration={800} animation={'bounceIn'}>
            <Onboarding3 />
          </Animatable.View>
        </View>
      )}
      {page === 3 && (
        <View style={styles.headerIcon}>
          <Animatable.View duration={800} animation={'bounceIn'}>
            <Onboarding4 />
          </Animatable.View>
        </View>
      )}

      <Animatable.View
        animation={'fadeInUpBig'}
        style={styles.onboardingContainer}>
        <Onboarding
          DoneButtonComponent={DoneBtn}
          SkipButtonComponent={skipBtn}
          NextButtonComponent={NextBtn}
          onSkip={async () => {
            if (Platform.OS === 'ios') {
              isShow
                ? navigation.navigate('Notification')
                : await AsyncStorage.setItem('onboarding', 'true');
            } else {
              navigation.navigate('Notification');
            }
          }}
          onDone={async () => {
            if (Platform.OS === 'ios') {
              isShow
                ? navigation.navigate('Notification')
                : await AsyncStorage.setItem('onboarding', 'true');
            } else {
              navigation.navigate('Notification');
            }
          }}
          bottomBarHighlight={false}
          containerStyles={styles.onboarding}
          titleStyles={styles.onboardingSubtitle}
          subTitleStyles={styles.onboardingTitle}
          imageContainerStyles={{
            flex: 1,
          }}
          pageIndexCallback={(index) => {
            setTimeout(() => {
              setPage(index);
            }, 1);
          }}
          pages={[
            {
              image: <SvgOnBoarding />,
              backgroundColor: 'white',
              title: 'Viewing production lines and run reports',
              subtitle: 'Live View',
            },
            {
              backgroundColor: 'white',
              image: <SvgOnBoarding2 />,
              title: 'Customize your factory report for more insights',
              subtitle: 'Report',
            },
            {
              backgroundColor: 'white',
              image: (
                <Image
                  source={IMAGE.ONBOARDING_3}
                  style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: 550,
                    resizeMode: Platform.OS === 'ios' ? 'stretch' : 'center',
                  }}
                />
              ),
              title: (
                <Text
                  style={{
                    color: THEME.PEW_COLOR,
                    marginTop: 0,
                    marginBottom: Platform.OS === 'ios' ? 35 : 32,
                    fontSize: 16,
                  }}>
                  Navigating multiple factories with ease
                </Text>
              ),
              subtitle: 'Switching Factories',
            },
            {
              backgroundColor: 'white',
              image: (
                <SvgOnBoarding4
                  style={{marginTop: 50}}
                  width={'50%'}
                  height={'40%'}
                />
              ),
              title: (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    color: THEME.DARK_COLOR,
                    textAlign: 'center',
                  }}>
                  LiveTracking mobile app will not {'\n'} access the following
                  on your device:
                </Text>
              ),
              subtitle: 'Privacy',
            },
          ]}
        />
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
  },
  headerIcon: {
    //height: '100%',
    flex: 2,
    maxHeight: Platform.OS === 'ios' ? 248 : 168,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 30,
  },
  onboarding: {
    backgroundColor: THEME.WHITE_COLOR,
    justifyContent: 'flex-start',
    flexDirection: 'column-reverse',
  },
  onboardingContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: THEME.WHITE_COLOR,
    justifyContent: 'flex-start',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: THEME.DARK_COLOR,
    shadowOffset: {
      width: -1,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
    paddingTop: 40,
    //boxShadow: '-1px -1px 10px rgba(0, 0, 0, 0.1)',
  },
  onboardingTitle: {
    fontSize: 26,
    fontFamily: FONT.SemiBold,
    color: THEME.PRIMARY_COLOR_DARK,
    marginBottom: 10,
  },
  onboardingSubtitle: {
    fontSize: 16,
    fontFamily: FONT.Regular,
    color: '#999',
  },
  skip: {
    color: THEME.ASH_COLOR,
    marginHorizontal: 30,
  },
  next: {
    color: THEME.PRIMARY_COLOR,
    marginHorizontal: 30,
  },
  done: {
    color: THEME.PRIMARY_COLOR,
    marginHorizontal: 30,
  },
});
