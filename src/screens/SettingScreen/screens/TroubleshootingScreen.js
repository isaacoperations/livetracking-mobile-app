import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Platform,
} from 'react-native';

import {THEME} from '../../../constants/theme';

import HeaderStatus from '../../../components/HeaderStatus';
import {ModalHeader} from '../../../components/ModalHeader';

import {Btn} from '../../../components/Button';
import {FONT} from '../../../constants/fonts';

export function TroubleShootingScreen({navigation}) {
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
            <Text style={styles.label}>
              Eiusmod tempor incididunt ut labore?
            </Text>
            <Text style={styles.content}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </Text>
            <Text style={styles.label}>Smod tempor incididunt ut labore?</Text>
            <Text style={styles.content}>
              Piscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam.
            </Text>
            <Text style={styles.label}>
              Labore et dolore magna aliqua. Ut enim ad minim veniam sed do
              eiusmod?
            </Text>
            <Text style={styles.content}>
              Dolor sit amet, consectetur piscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam. Ut enim ad minim veniam. Piscing elit, sed do eiusmod
              tempor.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.containerBottom}>
          <Btn
            title={'Customer Support'}
            onPress={() => console.log('Customer Support')}
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
  containerBottom: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 'auto',
    marginBottom: 50,
  },
});
