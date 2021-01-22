import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';
import {Btn} from '../../components/Button';
import HeaderStatus from '../../components/HeaderStatus';

export function AuthInfoScreen({navigation}) {
  return (
    <>
      <HeaderStatus ios={'dark'} />
      <View style={styles.container}>
        <Text style={styles.title}>
          You need to have an <Text style={{fontFamily: FONT.Bold}}>existing LiveTracking account</Text> to use this app. If
          your company uses LiveTracking, ask your administrator to add you
          user.
        </Text>
        <Btn
          title={'Learn more about LiveTracking'}
          onPress={() => navigation.navigate('Onboarding')}
          icon={false}
          navigation={navigation}
          borderColor={THEME.PRIMARY_COLOR}
          backgroundColor={THEME.WHITE_COLOR}
          backgroundColorHover={THEME.PRIMARY_COLOR}
          textColor={THEME.PRIMARY_COLOR}
          textColorHover={THEME.WHITE_COLOR}
          size={THEME.BUTTON_PRIMARY_SMALL}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: THEME.WHITE_COLOR,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.DARK_COLOR,
    marginBottom: 60,
    letterSpacing: 0.01,
  },
});
