import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Platform,
} from 'react-native';
import {Divider} from 'react-native-elements';
import crashlytics from '@react-native-firebase/crashlytics';

import {AuthContext, UserContext} from '../../context/context';
import {THEME} from '../../constants/theme';

import HeaderStatus from '../../components/HeaderStatus';
import {ModalHeader} from '../../components/ModalHeader';
import {SettingBtn} from './components/SettingBtn';
import {SettingUserInfo} from './components/SettingUserInfo';
import {Btn} from '../../components/Button';

export function SettingScreen({navigation}) {
  useEffect(() => {
    crashlytics().log('Setting - screen');
  }, []);
  const user = useContext(UserContext);
  const {logout} = useContext(AuthContext);
  const {
    userData: {name, picture, email},
  } = user;
  return (
    <>
      <HeaderStatus ios={'dark'} />
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={'Setting'}
          onPressClose={() => navigation.goBack()}
          iconTitleClose={'arrow-back-ios'}
          iconShow={false}
          backgroundColor={'#EDF0F3'}
        />
        <SettingUserInfo name={name} email={email} avatar={picture} />
        <ScrollView contentContainerStyle={{height: '100%'}}>
          <View style={{marginBottom: 'auto'}}>
            <Divider style={styles.divider} />
            <SettingBtn
              title={'Notification'}
              onPress={() => navigation.navigate('NotifySetting')}
            />
            <Divider style={styles.divider} />
            <SettingBtn
              title={'Security'}
              onPress={() => navigation.navigate('Security')}
            />
            <Divider style={styles.divider} />
            <SettingBtn
              title={'Troubleshooting'}
              onPress={() => navigation.navigate('Troubleshooting')}
            />
            <Divider style={styles.divider} />
            <SettingBtn
              title={'Token screen'}
              onPress={() => navigation.navigate('TokenScreen')}
            />
            <Divider style={styles.divider} />
            <Divider style={styles.divider} />
          </View>
          <View style={styles.containerBottom}>
            <Btn
              title={'Log out'}
              onPress={() => {
                crashlytics().log('Logout - button');
                logout();
              }}
              icon={false}
              navigation={navigation}
              borderColor={THEME.DARK_COLOR}
              backgroundColor={THEME.DARK_COLOR}
              backgroundColorHover={THEME.GRAY_COLOR}
              textColor={THEME.WHITE_COLOR}
              textColorHover={THEME.DARK_COLOR}
              size={THEME.BUTTON_PRIMARY_SMALL}
            />
          </View>
        </ScrollView>
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
  divider: {
    backgroundColor: THEME.ASH_COLOR,
  },
  containerBottom: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 50 : 20,
  },
});
