import React, {useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Platform,
  Linking,
} from 'react-native';
import {getDeviceToken, getVersion} from 'react-native-device-info';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

import HeaderStatus from '../../../components/HeaderStatus';
import {ModalHeader} from '../../../components/ModalHeader';
import {Btn} from '../../../components/Button';
import crashlytics from '@react-native-firebase/crashlytics';
import {sendEmail} from '../../../utils/sendEmail';

export function SecurityScreen({navigation}) {
  const supportedURL = 'https://www.livetracking.io/privacy-policy';
  // const brand = getBrand();
  const version = getVersion();
  const emailURL = 'support@livetracking.io';
  const emailSubject = 'Mobile App Support Request';
  const emailBody = `
===============<br/>
[Email body here]
<br/>===============<br/>
App version: v${version}<br/>
OS: <span style='text-transform: capitalize'>${Platform.OS}</span>`;

  useEffect(() => {
    if (Platform.OS === 'ios') {
      getDeviceToken().then((deviceToken) => {
        console.log('deviceToken', deviceToken);
      });
    }
  }, []);

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={'Security'}
          onPressClose={() => navigation.goBack()}
          iconTitleClose={'arrow-back-ios'}
          iconShow={false}
          backgroundColor={'#EDF0F3'}
        />
        <ScrollView>
          <View style={{padding: 30}}>
            <Text style={styles.content}>
              We use the Device Information that we collect to help us screen
              for potential risk and fraud (in particular, your IP address), and
              more generally to improve and optimize our Site and Apps (for
              example, by generating analytics about how our customers browse
              and interact with the Site, and to assess the success of our
              product roadmap decisions).
            </Text>
            <Text style={[styles.content]}>
              For more information about our privacy practices, if you have
              questions, or if you would like to make a complaint, please
              contact us by e-mail at{' '}
              <Text
                style={[styles.content, {color: THEME.PRIMARY_COLOR_DARK}]}
                onPress={() => {
                  sendEmail(emailSubject, emailURL, emailBody);
                }}>
                support@livetracking.io
              </Text>
            </Text>
          </View>
        </ScrollView>
        <View style={styles.containerBottom}>
          <Btn
            title={'More About Data Security'}
            onPress={async () => {
              crashlytics().log('More About Data Security - button');
              await Linking.openURL(supportedURL);
            }}
            icon={false}
            navigation={navigation}
            borderColor={THEME.DARK_COLOR}
            backgroundColor={THEME.GRAY_COLOR}
            backgroundColorHover={THEME.DARK_COLOR}
            textColor={THEME.DARK_COLOR}
            textColorHover={THEME.GRAY_COLOR}
            size={THEME.BUTTON_PRIMARY_SMALL}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.GRAY_COLOR,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  label: {
    color: THEME.DARK_COLOR,
    fontFamily: Platform.OS === 'ios' ? FONT.SemiBold : FONT.Bold,
    fontSize: 14,
  },
  content: {
    color: THEME.DARK_COLOR,
    fontFamily: FONT.Regular,
    fontSize: 15,
    marginBottom: 28,
  },
  info: {
    color: THEME.PEW_COLOR,
    fontFamily: FONT.Regular,
    fontSize: 11,
    marginTop: 12,
  },
  containerBottom: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 'auto',
    marginBottom: 50,
  },
});
