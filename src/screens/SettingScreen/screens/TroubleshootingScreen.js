import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Platform,
} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {getVersion, getBuildNumber} from 'react-native-device-info';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';
import {Btn} from '../../../components/Button';
import HeaderStatus from '../../../components/HeaderStatus';
import {ModalHeader} from '../../../components/ModalHeader';
import {sendEmail} from '../../../utils/sendEmail';

export function TroubleShootingScreen({navigation}) {
  // const brand = getBrand();
  const version = getVersion();
  const build = getBuildNumber();
  const emailURL = 'support@livetracking.com';
  const emailSubject = 'Mobile App Support Request';
  const emailBody = `
===============<br/>
[Email body here]
<br/>===============<br/>
App version: v${version}<br/>
OS: <span style='text-transform: capitalize'>${Platform.OS}</span>`;

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={'Troubleshooting'}
          onPressClose={() => navigation.goBack()}
          iconTitleClose={'arrow-back-ios'}
          iconShow={false}
          backgroundColor={'#EDF0F3'}
        />
        <ScrollView>
          <View style={{padding: 30}}>
            <Text style={styles.label}>Not seeing your factory data?</Text>
            <Text style={styles.content}>
              The LiveTracking mobile application is intended to be connected at
              all times. Please ensure you have a connection to the internet via
              cell or wifi networks.
            </Text>
            <Text style={styles.label}>Need to change your factory?</Text>
            <Text style={styles.content}>
              If you are a member of multiple factories, please tap on the
              LiveTracking icon at the top left of the app to scroll your
              assigned facilities
            </Text>
            <Text style={styles.label}>Have any other questions?</Text>
            <Text style={[styles.content]}>
              Please contact us via the button below, or by emailing{' '}
              <Text
                style={[styles.content, {color: THEME.PRIMARY_COLOR_DARK}]}
                onPress={() => {
                  sendEmail(emailSubject, emailURL, emailBody);
                }}>
                support@livetracking.com.
              </Text>{' '}
              We will respond as soon as possible.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.containerBottom}>
          <Btn
            title={'Customer Support'}
            onPress={() => {
              crashlytics().log('Customer Support - button');
              sendEmail(emailSubject, emailURL, emailBody);
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
        <Text style={{textAlign: 'center', fontSize: 11, marginBottom: 10}}>
          version: {version} {Platform.OS === 'ios' && `(${build})`}
        </Text>
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
  containerBottom: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 'auto',
    marginBottom: 30,
  },
});
