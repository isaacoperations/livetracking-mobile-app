import React, {useContext, useEffect} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, View} from 'react-native';
import {Divider} from 'react-native-elements';

import {THEME} from '../../constants/theme';

import HeaderStatus from '../../components/HeaderStatus';
import {ModalHeader} from '../../components/ModalHeader';
import {SettingBtn} from './components/SettingBtn';
import {SettingUserInfo} from './components/SettingUserInfo';

import {UserContext} from '../../context/context';

export function SettingScreen({navigation}) {
  const user = useContext(UserContext);
  const {
    userData: {name, picture},
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
        <SettingUserInfo
          name={name}
          email={'work@email.com'}
          avatar={picture}
        />
        <ScrollView>
          <View style={{flex: 1}}>
            <Divider style={styles.divider} />
            <SettingBtn
              title={'Notification'}
              onPress={() => console.log('Notification')}
            />
            <Divider style={styles.divider} />
            <SettingBtn
              title={'Security'}
              onPress={() => console.log('Security')}
            />
            <Divider style={styles.divider} />
            <SettingBtn
              title={'Troubleshooting'}
              onPress={() => console.log('Troubleshooting')}
            />
            <Divider style={styles.divider} />
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
});
