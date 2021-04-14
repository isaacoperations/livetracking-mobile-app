import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  Text,
} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import Clipboard from '@react-native-community/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';
import {Btn} from '../../../components/Button';
import HeaderStatus from '../../../components/HeaderStatus';
import {ModalHeader} from '../../../components/ModalHeader';
import Toast from 'react-native-toast-message';

export function TokenScreen({navigation}) {
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async () => {
    await AsyncStorage.getItem('tokenDevice').then((token) => {
      Clipboard.setString(token);
    });
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };
  return (
    <>
      <HeaderStatus ios={'dark'} />
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={'Token screen'}
          onPressClose={() => navigation.goBack()}
          iconTitleClose={'arrow-back-ios'}
          iconShow={false}
          backgroundColor={'#EDF0F3'}
        />
        <Text style={{marginTop: 40, padding: 20, fontSize: 16}}>
          {copiedText}
        </Text>
        <View style={styles.containerBottom}>
          <Btn
            title={'Token copy'}
            onPress={async () => {
              crashlytics().log('Token - button');
              await copyToClipboard();
              await fetchCopiedText();
              Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Copy token',
                topOffset: Platform.OS === 'ios' ? 80 : 30,
                visibilityTime: 300,
              });
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
  containerBottom: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 'auto',
    marginBottom: 50,
  },
});
