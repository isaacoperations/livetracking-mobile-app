import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

import {THEME} from '../../constants/theme';
import {Btn} from '../../components/Button';
import LogoWhiteSvg from '../../components/icons/LogoWhite';
import HeaderStatus from '../../components/HeaderStatus';

export function AuthenticationScreen({navigation}) {
  return (
    <>
      <HeaderStatus ios={'light'} />
      <View style={styles.container}>
        <LogoWhiteSvg style={styles.logo} />
        <View style={styles.containerBottom}>
          <Btn
            navigation={navigation}
            title={'Log in your LiveTracking account'}
            onPress={() => {
              crashlytics().log('Login - button');
              navigation.navigate('Login');
            }}
            borderColor={'white'}
            backgroundColor={THEME.PRIMARY_COLOR}
            backgroundColorHover={THEME.WHITE_COLOR}
            textColor={THEME.WHITE_COLOR}
            textColorHover={THEME.PRIMARY_COLOR}
            iconColor={THEME.WHITE_COLOR}
            iconColorHover={THEME.PRIMARY_COLOR}
            marginLeft={10}
          />
          <Btn
            navigation={navigation}
            title={'I don’t have an account'}
            onPress={() => {
              crashlytics().log('I don’t have an account - button');
              navigation.navigate('AuthInfo');
            }}
            borderColor={'white'}
            backgroundColor={THEME.PRIMARY_COLOR}
            backgroundColorHover={THEME.WHITE_COLOR}
            textColor={THEME.WHITE_COLOR}
            textColorHover={THEME.PRIMARY_COLOR}
            iconColor={THEME.WHITE_COLOR}
            iconColorHover={THEME.PRIMARY_COLOR}
            marginLeft={10}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: THEME.PRIMARY_COLOR,
    width: '100%',
    height: '100%',
  },
  logo: {
    marginTop: 'auto',
  },
  containerBottom: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
