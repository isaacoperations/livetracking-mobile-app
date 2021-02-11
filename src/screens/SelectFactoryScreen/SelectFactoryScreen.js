import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import {Divider} from 'react-native-elements';
import {THEME} from '../../constants/theme';

import HeaderStatus from '../../components/HeaderStatus';
import {ModalHeader} from '../../components/ModalHeader';
import {SelectFactoryItem} from './components/SelectFactoryItem';

export function SelectFactoryScreen({navigation}) {
  const HEIGHT = Dimensions.get('window').height;

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={'Select Factory'}
          onPressClose={() => navigation.goBack()}
          onPressSetting={() => navigation.navigate('Setting')}
          iconShow={true}
          iconColor={THEME.DARK_COLOR}
          iconTitleSetting={'settings'}
          backgroundColor={'#EDF0F3'}
        />
        <ScrollView>
          <SelectFactoryItem onPress={() => console.log('pressed')} />
          <SelectFactoryItem
            onPress={() => console.log('pressed')}
            iconShow={true}
          />
          <SelectFactoryItem
            onPress={() => console.log('pressed')}
            iconShow={true}
          />
          <SelectFactoryItem onPress={() => console.log('pressed')} />
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
});
