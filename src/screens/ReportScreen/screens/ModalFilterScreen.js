import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Divider, ListItem, CheckBox} from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import ModalDropdown from 'react-native-modal-dropdown';
//import DateRangePicker from 'react-native-daterange-picker';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import _ from 'lodash';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';
import {NodeLine, ProductLine} from '../../../utils/db/db';

import HeaderStatus from '../../../components/HeaderStatus';
import {ModalHeaderFilter} from '../components/ModalHeaderFilter';
import DatePickerComponent from '../components/DatePickerComponent';
import {Btn} from '../../../components/Button';
import {RBSheetHeader} from '../../../components/RBSheetHeader';

export function ModalFilterScreen({navigation}) {
  const parent = navigation.dangerouslyGetParent();
  const [modalValueText, setModalValueText] = useState('One day');
  const [isCheckVisibleLine, setIsCheckVisibleLine] = useState(false);
  const [isCheckVisibleProduct, setIsCheckVisibleProduct] = useState(false);
  const [countCheckProduct, setCountCheckProduct] = useState('All Products');
  const [checkData, setCheckData] = useState(NodeLine || []);
  const [checkAllLine, setCheckAllLine] = useState(false);
  const [checkAllProduct, setCheckAllProduct] = useState(false);
  const [checkDataProduct, setCheckDataProduct] = useState(ProductLine || []);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showAndroidTo, setShowAndroidTo] = useState(false);
  const [showAndroidFrom, setShowAndroidFrom] = useState(false);
  const [minDate, setMinDate] = useState(new Date(2020, 0, 1));
  const [maxDate, setMaxDate] = useState(new Date(2050, 11, 30));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [displayedDate, setDisplayedDate] = useState(moment());
  const [date, setDate] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [dateFrom, setDateFrom] = useState(new Date());
  const refRBSheetDate = useRef();
  const refRBSheetTo = useRef();
  const refRBSheetFrom = useRef();
  const refRBSheetProduct = useRef();
  const HEIGHT = Dimensions.get('window').height;

  useEffect(() => {
    (async () => {
      await MaterialCommunityIcons.loadFont();
      await MaterialIcons.loadFont();
    })();
    console.log('date', date);
    console.log('dateTo', dateTo);
    console.log('dateFrom', dateFrom);
    console.log('checkData', checkData);
    console.log('checkDataProduct', checkDataProduct);

    parent.setOptions({
      tabBarVisible: false,
    });
    return () =>
      parent.setOptions({
        tabBarVisible: true,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkData, checkDataProduct, isCheckVisibleLine, isCheckVisibleProduct]);

  // ==== LINE ==== //

  const handleChecked = (id) => {
    const data = checkData.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          selected: !item.selected || false,
        };
      }
      return {
        ...item,
        selected: item.selected || false,
      };
    });
    const uniqDataBy = _.uniqBy(data, 'selected');
    const some = _.some(uniqDataBy, ['selected', true]);
    if (some) {
      setIsCheckVisibleLine(true);
    } else {
      setIsCheckVisibleLine(false);
    }
    setCheckData(data);
  };

  const handleAllLine = () => {
    const data = checkData.map((item) => {
      return {
        ...item,
        selected: !checkAllLine,
      };
    });
    setCheckData(data);
    setIsCheckVisibleLine(false);
  };

  // ==== PRODUCT ==== //

  const handleCheckedProduct = (id) => {
    const data = checkDataProduct.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          selected: !item.selected || false,
        };
      }
      return {
        ...item,
        selected: item.selected || false,
      };
    });
    const some = _.some(data, ['selected', true]);
    if (some) {
      setIsCheckVisibleProduct(true);
    } else {
      setIsCheckVisibleProduct(false);
    }
    const reject = _.reject(data, function (o) {
      return !o.selected;
    });
    const size = _.size(reject);
    setCountCheckProduct(`Products (${size})`);
    setCheckDataProduct(data);
  };

  const handleAllProduct = () => {
    const data = checkDataProduct.map((item) => {
      return {
        ...item,
        selected: !checkAllProduct,
      };
    });
    const reject = _.reject(data, function (o) {
      return !o.selected;
    });
    const size = _.size(reject);
    setCountCheckProduct(`Products (${size})`);
    setCheckDataProduct(data);
    setIsCheckVisibleProduct(false);
  };

  // ==== DATE ==== //

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowAndroid(false);
    }
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onChangeFrom = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowAndroidFrom(false);
    }
    const currentDate = selectedDate || dateFrom;
    setDateFrom(currentDate);
    setDateTo(currentDate);
    setMinDate(currentDate);
  };

  const onChangeTo = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowAndroidTo(false);
    }
    const currentDate = selectedDate || dateTo;
    console.log('currentDate', currentDate);
    setDateTo(currentDate);
  };

  const setDatesRange = (dates) => {
    console.log('setDatesRange', dates);
  };

  const handleSubmit = () => {
    const data = {
      date: date,
      dateTo: dateTo,
      dateFrom: dateFrom,
    };
    console.log('handleSubmit', JSON.stringify(data, 2, null));
    navigation.navigate('ReportScreen');
  };

  const handleReset = () => {
    console.log('handleReset');
    setDate(new Date());
    setDateTo(new Date());
    setDateFrom(new Date());

    const dataLine = checkData.map((item) => {
      return {
        ...item,
        selected: false,
      };
    });
    setIsCheckVisibleLine(false);
    setCheckData(dataLine);

    const dataProduct = checkDataProduct.map((item) => {
      return {
        ...item,
        selected: false,
      };
    });
    setCountCheckProduct('All products');
    setCheckDataProduct(dataProduct);
    setIsCheckVisibleProduct(false);
  };

  return (
    <>
      <HeaderStatus />
      <SafeAreaView style={styles.container}>
        <ModalHeaderFilter
          title={'Filters'}
          onPress={() => navigation.navigate('ReportScreen')}
        />
        {/* Start Scroll */}
        <ScrollView nestedScrollEnabled={true}>
          <View style={{padding: 20}}>
            <ModalDropdown
              options={['One day', 'Multi-Day']}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.textStyle}
              scrollEnabled={false}
              dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
              textStyle={styles.text}
              style={{width: 170, height: 60}}
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

            <View style={{marginTop: -15}}>
              {modalValueText && modalValueText === 'One day' ? (
                <>
                  <DatePickerComponent
                    date={moment(date).format('MMM DD, YYYY')}
                    title={'Date'}
                    onPress={() => {
                      Platform.OS === 'ios'
                        ? refRBSheetDate.current.open()
                        : setShowAndroid(true);
                    }}
                  />
                  {Platform.OS === 'ios' ? (
                    <RBSheet
                      ref={refRBSheetDate}
                      closeOnDragDown={false}
                      height={Platform.OS === 'ios' ? 300 : 200}
                      closeOnPressMask={false}
                      customStyles={{
                        wrapper: {
                          backgroundColor: 'transparent',
                        },
                        container: {
                          borderTopRightRadius: 20,
                          borderTopLeftRadius: 20,
                        },
                      }}>
                      <View style={styles.sheetCustomHeader}>
                        <TouchableOpacity
                          onPress={() => refRBSheetDate.current.close()}
                          style={styles.sheetCustomClose}>
                          <MaterialIcons
                            name="close"
                            size={20}
                            color={'black'}
                          />
                        </TouchableOpacity>
                        <View style={styles.sheetCustomTitle}>
                          <Text style={{fontSize: 17, fontFamily: FONT.Medium}}>
                            Datepicker
                          </Text>
                        </View>
                        <View style={{flex: 1}} />
                      </View>
                      <RNDateTimePicker
                        value={date}
                        mode={'date'}
                        display={'spinner'}
                        dateFormat="month day year"
                        onChange={onChangeDate}
                        minimumDate={minDate}
                        maximumDate={maxDate}
                        textColor="black"
                      />
                    </RBSheet>
                  ) : (
                    showAndroid && (
                      <>
                        <RNDateTimePicker
                          value={date}
                          mode={'date'}
                          display={'default'}
                          dateFormat="month day year"
                          onChange={onChangeDate}
                          minimumDate={minDate}
                          maximumDate={maxDate}
                          textColor="black"
                        />
                        {/*<DateRangePicker*/}
                        {/*  onChange={setDatesRange}*/}
                        {/*  endDate={endDate}*/}
                        {/*  startDate={startDate}*/}
                        {/*  displayedDate={displayedDate}*/}
                        {/*  range={true}>*/}
                        {/*  <Text>Click me!</Text>*/}
                        {/*</DateRangePicker>*/}
                      </>
                    )
                  )}
                </>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginRight: 10}}>
                    <DatePickerComponent
                      date={moment(dateFrom).format('MMM DD, YYYY')}
                      title={'From'}
                      onPress={() => {
                        Platform.OS === 'ios'
                          ? refRBSheetFrom.current.open()
                          : setShowAndroidFrom(true);
                      }}
                    />
                    {Platform.OS === 'ios' ? (
                      <RBSheet
                        ref={refRBSheetFrom}
                        closeOnDragDown={false}
                        height={Platform.OS === 'ios' ? 300 : 200}
                        closeOnPressMask={false}
                        customStyles={{
                          wrapper: {
                            backgroundColor: 'transparent',
                          },
                          container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                          },
                        }}>
                        <View style={styles.sheetCustomHeader}>
                          <TouchableOpacity
                            onPress={() => refRBSheetFrom.current.close()}
                            style={styles.sheetCustomClose}>
                            <MaterialIcons
                              name="close"
                              size={20}
                              color={'black'}
                            />
                          </TouchableOpacity>
                          <View style={styles.sheetCustomTitle}>
                            <Text
                              style={{fontSize: 17, fontFamily: FONT.Medium}}>
                              Datepicker
                            </Text>
                          </View>
                          <View style={{flex: 1}} />
                        </View>
                        <RNDateTimePicker
                          value={dateFrom}
                          mode={'date'}
                          display={'spinner'}
                          dateFormat="month day year"
                          minimumDate={new Date(2020, 0, 1)}
                          maximumDate={maxDate}
                          onChange={onChangeFrom}
                          textColor="black"
                        />
                      </RBSheet>
                    ) : (
                      showAndroidFrom && (
                        <RNDateTimePicker
                          value={dateFrom}
                          mode={'date'}
                          display={'default'}
                          dateFormat="month day year"
                          minimumDate={minDate}
                          maximumDate={maxDate}
                          onChange={onChangeFrom}
                          textColor="black"
                        />
                      )
                    )}
                  </View>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <DatePickerComponent
                      date={moment(dateTo).format('MMM DD, YYYY')}
                      title={'To'}
                      onPress={() => {
                        Platform.OS === 'ios'
                          ? refRBSheetTo.current.open()
                          : setShowAndroidTo(true);
                      }}
                    />
                    {Platform.OS === 'ios' ? (
                      <RBSheet
                        ref={refRBSheetTo}
                        closeOnDragDown={false}
                        height={Platform.OS === 'ios' ? 300 : 200}
                        closeOnPressMask={false}
                        customStyles={{
                          wrapper: {
                            backgroundColor: 'transparent',
                          },
                          container: {
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                          },
                        }}>
                        <View style={styles.sheetCustomHeader}>
                          <TouchableOpacity
                            onPress={() => refRBSheetTo.current.close()}
                            style={styles.sheetCustomClose}>
                            <MaterialIcons
                              name="close"
                              size={20}
                              color={'black'}
                            />
                          </TouchableOpacity>
                          <View style={styles.sheetCustomTitle}>
                            <Text
                              style={{fontSize: 17, fontFamily: FONT.Medium}}>
                              Datepicker
                            </Text>
                          </View>
                          <View style={{flex: 1}} />
                        </View>
                        <RNDateTimePicker
                          value={dateTo}
                          mode={'date'}
                          display={'spinner'}
                          dateFormat="month day year"
                          onChange={onChangeTo}
                          minimumDate={minDate}
                          maximumDate={maxDate}
                          textColor="black"
                        />
                      </RBSheet>
                    ) : (
                      showAndroidTo && (
                        <RNDateTimePicker
                          value={dateTo}
                          mode={'date'}
                          display={'default'}
                          dateFormat="month day year"
                          minimumDate={minDate}
                          maximumDate={maxDate}
                          onChange={onChangeTo}
                          textColor="black"
                        />
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
          <Divider style={styles.divider} />
          {/* Container for Node list Title */}
          <View style={{height: 350}}>
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
                        name={
                          !isCheckVisibleLine ? 'check-circle' : 'remove-circle'
                        }
                        size={24}
                        color={THEME.PRIMARY_COLOR}
                      />
                    }
                    uncheckedIcon={
                      <MaterialCommunityIcons
                        name={
                          isCheckVisibleLine ? 'minus-circle' : 'circle-outline'
                        }
                        size={24}
                        color={THEME.PRIMARY_COLOR}
                      />
                    }
                    checked={checkAllLine}
                    onPress={() => {
                      console.log('check line');
                      handleAllLine();
                      setCheckAllLine(!checkAllLine);
                    }}
                  />
                </View>
              </ListItem.Content>
            </ListItem>
            <Divider style={styles.divider} />
            {/* ScrollView Container for Node list */}
            <ScrollView nestedScrollEnabled={true}>
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
                          checked={item.selected || false}
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
          {/* product Container */}
          <View style={styles.productContainer}>
            <Text style={styles.productLabel}>Products</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => refRBSheetProduct.current.open()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.productItemsLabel}>{countCheckProduct}</Text>
              <MaterialIcons
                name={'keyboard-arrow-right'}
                size={20}
                color={'black'}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* End */}
        {/* Button */}
        <View
          style={[
            styles.containerBottom,
            {
              borderTopWidth: 1,
              borderColor: THEME.GRAY_COLOR,
            },
          ]}>
          <Pressable
            onPress={handleReset}
            style={{flex: 1, height: 44, justifyContent: 'center'}}>
            {({pressed}) => (
              <Text
                style={[
                  {
                    color: pressed ? THEME.DANGER_COLOR : THEME.ASH_COLOR,
                    justifyContent: 'center',
                  },
                  styles.text,
                ]}>
                Reset
              </Text>
            )}
          </Pressable>
          <View style={{flex: 1, marginTop: 'auto'}}>
            <Btn
              navigation={navigation}
              title={'Apply'}
              onPress={handleSubmit}
              borderColor={THEME.PRIMARY_COLOR}
              backgroundColor={THEME.PRIMARY_COLOR}
              backgroundColorHover={THEME.WHITE_COLOR}
              textColor={THEME.WHITE_COLOR}
              textColorHover={THEME.PRIMARY_COLOR}
              size={THEME.BUTTON_PRIMARY_SMALL}
            />
          </View>
        </View>

        {/* Modal Product */}
        <View>
          <RBSheet
            ref={refRBSheetProduct}
            closeOnDragDown={false}
            height={HEIGHT - (Platform.OS === 'ios' ? 70 : 50)}
            closeOnPressMask={false}
            customStyles={{
              wrapper: {
                backgroundColor: 'transparent',
              },
              container: {
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              },
            }}>
            <RBSheetHeader
              onPress={() => refRBSheetProduct.current.close()}
              title={'Products'}
              iconName={'keyboard-arrow-left'}
              iconSize={30}
            />
            <ScrollView>
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
                    All Products
                  </ListItem.Title>
                  <View>
                    <CheckBox
                      checkedIcon={
                        <MaterialIcons
                          name={
                            isCheckVisibleProduct
                              ? 'remove-circle'
                              : 'check-circle'
                          }
                          size={24}
                          color={THEME.PRIMARY_COLOR}
                        />
                      }
                      uncheckedIcon={
                        <MaterialCommunityIcons
                          name={
                            isCheckVisibleProduct
                              ? 'minus-circle'
                              : 'circle-outline'
                          }
                          size={24}
                          color={THEME.PRIMARY_COLOR}
                        />
                      }
                      checked={checkAllProduct}
                      onPress={() => {
                        console.log('check product');
                        handleAllProduct();
                        setCheckAllProduct(!checkAllProduct);
                      }}
                    />
                  </View>
                </ListItem.Content>
              </ListItem>
              {checkDataProduct.map((item, i) => (
                <ListItem
                  key={i}
                  containerStyle={{
                    paddingLeft: 30,
                    backgroundColor: 'white',
                  }}
                  activeOpacity={1}
                  onPress={() => handleCheckedProduct(item.id)}>
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
                            style={{color: THEME.PRIMARY_COLOR}}
                          />
                        }
                        uncheckedIcon={
                          <MaterialCommunityIcons
                            name={'circle-outline'}
                            size={24}
                            style={{color: THEME.PRIMARY_COLOR}}
                          />
                        }
                        checked={item.selected || false}
                        onPress={() => handleCheckedProduct(item.id)}
                      />
                    </View>
                  </ListItem.Content>
                </ListItem>
              ))}
            </ScrollView>
          </RBSheet>
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
    height: 104,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    //backgroundColor: 'red'
  },
  containerBottomButton: {
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: -2,
    },
    shadowOpacity: 1,
    shadowRadius: 16.0,
    elevation: 16,
    //padding: 5,
    marginTop: 'auto',
    //backgroundColor: 'red',
    //borderTopWidth: 5,
  },
  text: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    fontFamily: FONT.SemiBold,
  },
});
