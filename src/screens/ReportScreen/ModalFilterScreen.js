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
import ModalDropdown from 'react-native-modal-dropdown';
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
  const [modalValueText, setModalValueText] = useState('One day');

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
          <ModalHeaderFilter
            title={'Filters'}
            onPress={() => console.log('ModalHeaderFilter')}
          />
          <View style={{padding: 20}}>
            <ModalDropdown
              options={['One day', 'Multi-Day']}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.textStyle}
              scrollEnabled={false}
              dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
              textStyle={styles.text}
              style={{}}
              onSelect={(idx, value) => {
                if (idx === 0) {
                  console.log(value);
                  setModalValueText(value);
                } else {
                  console.log(value);
                  setModalValueText(value);
                }
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.modalValueText}>{modalValueText}</Text>
                <MaterialIcons
                  size={20}
                  name="arrow-drop-down"
                  color={THEME.PRIMARY_COLOR}
                />
              </View>
            </ModalDropdown>
            <View>
              <Text>Date</Text>
              <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons
                  size={20}
                  name="calendar-blank-outline"
                  color={THEME.CHAR_COLOR}
                />
                <Text style={{color: THEME.PRIMARY_COLOR, fontSize: 15, fontFamily: FONT.Regular}}>Sep 1, 2020</Text>
              </View>
            </View>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: Platform.OS === 'ios' ? 58 : 10,
    flexDirection: 'column',
  },
  dropdownStyle: {
    width: 138,
    height: 111,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.24,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 0,
    paddingTop: 10,
    paddingBottom: 0,
    marginTop: -30,
    marginLeft: 10,
  },
  dropdownTextHighlightStyle: {
    color: THEME.DARK_COLOR,
    backgroundColor: THEME.GRAY_COLOR,
  },
  textStyle: {
    fontSize: 15,
    lineHeight: 22,
    color: THEME.DARK_COLOR,
    fontFamily: FONT.Regular,
    paddingLeft: 16,
  },
  modalValueText: {
    color: THEME.PRIMARY_COLOR,
    fontSize: 15,
    fontFamily: FONT.Regular,
    marginRight: 50,
    marginLeft: 20,
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
