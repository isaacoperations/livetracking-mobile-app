import React, {useContext, useEffect, useState, useRef} from 'react';
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
import {Divider, ListItem, CheckBox} from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import ModalDropdown from 'react-native-modal-dropdown';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';
import {UserContext} from '../../../context/context';

import HeaderStatus from '../../../components/HeaderStatus';
import {ModalHeaderFilter} from '../components/ModalHeaderFilter';
import DatePickerComponent from './../components/DatePickerComponent';
import {NodeLine} from './../db/db';
import {Btn} from '../../../components/Button';

export function ModalProductScreen({navigation}) {
  const user = useContext(UserContext);
  const [isVisible, setIsVisible] = useState(true);
  const [modalValueText, setModalValueText] = useState('One day');
  const [checkData, setCheckData] = useState(NodeLine);
  //const parent = navigation.dangerouslyGetParent();

  useEffect(() => {
    console.log('home user', user?.token);
    (async () => {
      await MaterialCommunityIcons.loadFont();
      await MaterialIcons.loadFont();
    })();
    // parent.setOptions({
    //   tabBarVisible: false,
    // });
    // return () =>
    //   parent.setOptions({
    //     tabBarVisible: true,
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChecked = (id) => {
    let data = checkData.slice();
    const index = data.findIndex((x) => x.id === id);
    data[index].isChecked = !data[index].isChecked;
    setCheckData(data);
  };

  return (
    <>
      <HeaderStatus />
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}>
          <ListItem
            key={123123123123}
            containerStyle={{
              paddingLeft: 30,
              backgroundColor: 'white',
            }}
            activeOpacity={1}>
            <ListItem.Content
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <ListItem.Title
                style={{
                  color: THEME.DARK_COLOR,
                  fontSize: 15,
                  fontFamily: FONT.SemiBold,
                }}>
                All lines
              </ListItem.Title>
              <View>
                <CheckBox
                  checkedIcon={
                    <MaterialIcons
                      name={'check-circle'}
                      size={24}
                      color={THEME.PRIMARY_COLOR}
                    />
                  }
                  uncheckedIcon={
                    <MaterialCommunityIcons
                      name={'circle-outline'}
                      size={24}
                      color={THEME.PRIMARY_COLOR}
                    />
                  }
                  checked={false}
                  onPress={() => true}
                />
              </View>
            </ListItem.Content>
          </ListItem>
          <Divider style={styles.divider} />
          <ScrollView>
            {checkData.map((item, i) => (
              <>
                <ListItem
                  key={i}
                  containerStyle={{
                    paddingLeft: 30,
                    backgroundColor: 'white',
                  }}
                  activeOpacity={1}
                  onPress={() => handleChecked(item.id)}>
                  <ListItem.Content
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <ListItem.Title style={{color: THEME.DARK_COLOR}}>
                      {item.title}
                    </ListItem.Title>
                    <View>
                      <CheckBox
                        checkedIcon={
                          <MaterialIcons
                            name={'check-circle'}
                            size={24}
                            color={THEME.PRIMARY_COLOR}
                          />
                        }
                        uncheckedIcon={
                          <MaterialCommunityIcons
                            name={'circle-outline'}
                            size={24}
                            color={THEME.PRIMARY_COLOR}
                          />
                        }
                        checked={item.isChecked}
                        onPress={() => handleChecked(item.id)}
                      />
                    </View>
                  </ListItem.Content>
                </ListItem>
                <Divider style={styles.divider} />
              </>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: Platform.OS === 'ios' ? 58 : 10,
    flexDirection: 'column',
  },
  dropdownStyle: {
    width: 155,
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
    marginRight: 'auto',
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
  sheetCustomStyles: {},
  sheetCustomHeader: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: THEME.GRAY_COLOR,
    width: '100%',
    height: 56,
  },
  sheetCustomClose: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  sheetCustomTitle: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.GRAY_COLOR,
  },
  productLabel: {
    fontSize: 15,
    fontFamily: FONT.SemiBold,
    color: THEME.DARK_COLOR,
  },
  productItemsLabel: {
    fontSize: 12,
    fontFamily: FONT.Regular,
    color: THEME.PEW_COLOR,
    marginRight: 10,
  },
  containerBottom: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 0,
    height: 104,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
    //backgroundColor: 'red'
  },
  containerBottomButton: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16.0,
    elevation: 16,
    //borderTopWidth: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    fontFamily: FONT.SemiBold,
  },
});
