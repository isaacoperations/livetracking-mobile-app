import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {Divider, BottomSheet} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';
import {UserContext} from '../../context/context';

import HeaderStatus from '../../components/HeaderStatus';
import {ReportHeaderFilter} from '../../components/ReportHeaderFilter';
import {ReportHeaderBack} from '../../components/ReportHeaderBack';
import LogoMini from '../../components/LogoMini';
import {ModalHeaderFilter} from '../../components/ModalHeaderFilter';

export function ModalFilterScreen({navigation}) {
  const user = useContext(UserContext);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.log('home user', user?.token);
    (async () => {
      await MaterialCommunityIcons.loadFont();
      await MaterialIcons.loadFont();
    })();
  }, []);

  return (
    <>
      <HeaderStatus />
      <SafeAreaView style={styles.container}>
        <BottomSheet
          isVisible={isVisible}
          containerStyle={styles.containerStyle}>
          <ModalHeaderFilter title={'Filters'} onPress={() => console.log('ModalHeaderFilter')} />
        </BottomSheet>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: Platform.OS === 'ios' ? 158 : 10,
    flexDirection: 'column',
  },
  block: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  divider: {
    backgroundColor: THEME.GRAY_COLOR,
    marginLeft: -30,
    marginRight: -30,
  },
});
