import React, {useEffect, useState, useRef, Fragment, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import {Divider, ListItem, CheckBox} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import ModalDropdown from 'react-native-modal-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import crashlytics from '@react-native-firebase/crashlytics';
import moment from 'moment';
import _ from 'lodash';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

import {sleep} from '../../../utils/sleep';
import {useData} from '../../../services/ApiService';
import {AuthContext} from '../../../context/context';

import HeaderStatus from '../../../components/HeaderStatus';
import {ModalHeader} from '../../../components/ModalHeader';
import DatePickerComponent from '../components/DatePickerComponent';
import {Btn} from '../../../components/Button';
import {RBSheetHeader} from '../../../components/RBSheetHeader';
import {EmptyComponent} from '../components/EmptyComponent';

export function ModalFilterScreen({navigation, route}) {
  const [modalValueText, setModalValueText] = useState('One day');
  const [selectOneDay, setSelectOneDay] = useState(true);
  const [isCheckVisibleLine, setIsCheckVisibleLine] = useState(false);
  const [isCheckVisibleProduct, setIsCheckVisibleProduct] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleDate, setModalVisibleDate] = useState(false);
  const [countCheckProduct, setCountCheckProduct] = useState('All Products');
  const [lineData, setLineData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [checkAllLine, setCheckAllLine] = useState(false);
  const [checkAllProduct, setCheckAllProduct] = useState(false);
  const [date, setDate] = useState(moment());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const refRBSheetProduct = useRef();

  let bool = _.isEmpty(route?.params?.filterDataTab);

  const HEIGHT = Dimensions.get('window').height;
  const WIDTH = Dimensions.get('window').width;
  const minDate = new Date(2020, 0, 1);
  const maxDate = new Date(2050, 11, 30);

  const {ApiService} = useData();
  const {refreshTokens} = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      await MaterialCommunityIcons.loadFont();
      await MaterialIcons.loadFont();
      crashlytics().log('Filters - screen');
      if (bool) {
        await fetchLineData();
        setCheckAllLine(true);

        await fetchProductData();
        setCheckAllProduct(true);
      } else {
        fetchLocalData();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==== LOCAL DATA ==== //

  function fetchLocalData() {
    const {
      lineDataFull,
      productDataFull,
      lineData,
      productData,
    } = route?.params?.filterDataTab;
    setLineData(lineDataFull);
    setProductData(productDataFull);

    const tempLine = _.filter(lineDataFull, ['selected', true]);
    const sizeLine = _.size(tempLine);

    const tempProduct = _.filter(productDataFull, ['selected', true]);
    const sizeProduct = _.size(tempProduct);

    if (sizeLine > 0) {
      const uniqDataBy = _.uniqBy(lineDataFull, 'selected');
      const some = _.some(uniqDataBy, ['selected', true]);
      if (some) {
        setIsCheckVisibleLine(true);
      } else {
        setIsCheckVisibleLine(false);
      }
    } else {
      setCheckAllLine(false);
    }

    if (sizeProduct > 0) {
      const uniqDataBy = _.uniqBy(productDataFull, 'selected');
      const some = _.some(uniqDataBy, ['selected', true]);
      if (some) {
        setIsCheckVisibleProduct(true);
      } else {
        setIsCheckVisibleProduct(false);
      }
    } else {
      setCheckAllProduct(false);
    }

    if (lineDataFull.length === lineData.length) {
      setCheckAllLine(true);
      setIsCheckVisibleLine(false);
    }

    if (productDataFull.length === productData.length) {
      setCheckAllProduct(true);
      setIsCheckVisibleProduct(false);
    }

    const reject = _.reject(productDataFull, function (o) {
      return !o.selected;
    });
    const size = _.size(reject);
    setCountCheckProduct(`Products (${size})`);
  }

  // ==== LINE ==== //

  async function fetchLineData() {
    try {
      await ApiService.getLines().then(async ({data}) => {
        const dataX = data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            selected: true,
          };
        });
        setLineData(dataX);
        setIsCheckVisibleLine(false);
      });
    } catch (e) {
      crashlytics().log('Filters error - line');
      crashlytics().recordError(e.message);
      refreshTokens();
    }
  }

  async function fetchProductData() {
    try {
      await ApiService.getProducts().then(async ({data}) => {
        // setProductData(data);

        const dataX = data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            selected: true,
          };
        });
        const reject = _.reject(dataX, function (o) {
          return !o.selected;
        });
        const size = _.size(reject);
        setCountCheckProduct(`Products (${size})`);
        setProductData(dataX);
        setIsCheckVisibleProduct(false);
      });
    } catch (e) {
      crashlytics().log('Filters error - product');
      crashlytics().recordError(e.message);
      refreshTokens();
    }
  }

  const handleCheckedLine = (id) => {
    crashlytics().log('Filters check - line');
    const data = lineData.map((item) => {
      if (item.id === id) {
        return {
          id: item.id,
          name: item.name,
          selected: !item.selected || false,
        };
      }
      return {
        id: item.id,
        name: item.name,
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
    setLineData(data);
  };

  const handleAllLine = () => {
    crashlytics().log('Filters all check - line');
    const data = lineData.map((item) => {
      return {
        id: item.id,
        name: item.name,
        selected: !checkAllLine,
      };
    });
    setLineData(data);
    setIsCheckVisibleLine(false);
  };

  // ==== PRODUCT ==== //

  const handleCheckedProduct = (id) => {
    crashlytics().log('Filters check - product');
    const data = productData.map((item) => {
      if (item.id === id) {
        return {
          id: item.id,
          name: item.name,
          selected: !item.selected || false,
        };
      }
      return {
        id: item.id,
        name: item.name,
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
    setProductData(data);
  };

  const handleAllProduct = () => {
    crashlytics().log('Filters all check - product');
    const data = productData.map((item) => {
      return {
        id: item.id,
        name: item.name,
        selected: !checkAllProduct,
      };
    });
    const reject = _.reject(data, function (o) {
      return !o.selected;
    });
    const size = _.size(reject);
    setCountCheckProduct(`Products (${size})`);
    setProductData(data);
    setIsCheckVisibleProduct(false);
  };

  const renderProductItem = ({item}) => (
    <ListItem
      key={item.id}
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
          {item.name}
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
  );

  // ==== DATE ==== //

  const setDates = (dates) => {
    setDate(dates);
    sleep(500).then(() => {
      setModalVisibleDate(false);
    });
  };

  const setDatesRange = (dates, type) => {
    if (type === 'END_DATE') {
      setEndDate(dates);
      sleep(500).then(() => {
        setModalVisible(false);
      });
    } else {
      setStartDate(dates);
      setEndDate(null);
    }
  };

  // ==== SUBMIT FORM ==== //

  const handleSubmit = () => {
    crashlytics().log('Filters - button apply');
    const filterLine = _.filter(lineData, ['selected', true]);
    const filterProduct = _.filter(productData, ['selected', true]);
    const lineSelected = _.map(filterLine, 'id');
    const productSelected = _.map(filterProduct, 'id');
    const yesterday = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DDTHH:mm:ss[.000Z]');
    const today = moment().format('YYYY-MM-DDTHH:mm:ss[.000Z]');
    console.log('productData submit', productData);
    const data = {
      lineData: lineSelected.length > 0 ? lineSelected : null,
      lineDataFull: lineData,
      productData: productSelected.length > 0 ? productSelected : null,
      productDataFull: productData,
      selectDay: selectOneDay,
      date: date ? date.format('YYYY-MM-DDTHH:mm:ss[.000Z]') : today,
      dateFrom: startDate
        ? startDate.format('YYYY-MM-DDTHH:mm:ss[.000Z]')
        : yesterday,
      dateTo: endDate ? endDate.format('YYYY-MM-DDTHH:mm:ss[.000Z]') : today,
    };
    navigation.navigate('ReportScreen', {
      filterData: data,
    });
  };

  const handleReset = () => {
    crashlytics().log('Filters - button reset');
    setDate(moment().subtract(1, 'days'));
    setStartDate(moment().subtract(1, 'days'));
    setEndDate(moment());
    setModalVisibleDate(false);
    setModalVisible(false);
    setSelectOneDay(true);

    const dataLine = lineData.map((item) => {
      return {
        id: item.id,
        name: item.name,
        selected: true,
      };
    });
    const filterLineId = _.map(dataLine, 'id');
    setIsCheckVisibleLine(false);
    setLineData(dataLine);

    const dataProduct = productData.map((item) => {
      return {
        id: item.id,
        name: item.name,
        selected: true,
      };
    });
    const filterProductId = _.map(dataProduct, 'id');
    setCountCheckProduct('All products');
    setProductData(dataProduct);
    setIsCheckVisibleProduct(false);

    const yesterday = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DDTHH:mm:ss[.000Z]');
    const today = moment().format('YYYY-MM-DDTHH:mm:ss[.000Z]');
    const data = {
      lineData: filterLineId,
      lineDataFull: dataLine,
      productData: filterProductId,
      productDataFull: dataProduct,
      date: today,
      dateFrom: yesterday,
      dateTo: today,
    };
    navigation.navigate('ReportScreen', {
      filterData: undefined,
    });
  };

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <SafeAreaView style={[styles.container]}>
        <ModalHeader
          title={'Filters'}
          onPressClose={() =>
            navigation.navigate('ReportScreen', {
              filterData: !bool ? route?.params?.filterDataTab : undefined,
            })
          }
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
                  setModalValueText(value);
                  setSelectOneDay(true);
                } else {
                  setModalValueText(value);
                  setSelectOneDay(false);
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
                    date={
                      date
                        ? date.format('MMM DD, YYYY')
                        : moment().format('MMM DD, YYYY')
                    }
                    title={'Date'}
                    onPress={() => setModalVisibleDate(true)}
                  />
                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisibleDate}
                    onRequestClose={() => setModalVisibleDate(false)}>
                    <View style={styles.modalCentered}>
                      <TouchableOpacity
                        onPress={() => setModalVisibleDate(false)}
                        style={styles.modalClose}>
                        <MaterialIcons
                          name={'close'}
                          size={20}
                          color={THEME.DARK_COLOR}
                        />
                      </TouchableOpacity>
                      <View style={styles.modalCalendarContainer}>
                        <CalendarPicker
                          testID={1}
                          startFromMonday={true}
                          allowRangeSelection={false}
                          minDate={minDate}
                          maxDate={maxDate}
                          todayTextStyle={THEME.WHITE_COLOR}
                          todayBackgroundColor={THEME.WHITE_COLOR}
                          selectedDayColor={THEME.PRIMARY_COLOR}
                          selectedDayTextColor="#fff"
                          width={WIDTH - 70}
                          onDateChange={setDates}
                          previousComponent={
                            <MaterialIcons
                              name={'arrow-back-ios'}
                              size={20}
                              color={THEME.DARK_COLOR}
                            />
                          }
                          nextComponent={
                            <MaterialIcons
                              name={'arrow-forward-ios'}
                              size={20}
                              color={THEME.DARK_COLOR}
                            />
                          }
                        />
                      </View>
                    </View>
                  </Modal>
                </>
              ) : (
                <>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, marginRight: 10}}>
                      <DatePickerComponent
                        date={
                          startDate
                            ? startDate.format('MMM DD, YYYY')
                            : moment()
                                .subtract(1, 'days')
                                .format('MMM DD, YYYY')
                        }
                        title={'From'}
                        onPress={() => setModalVisible(true)}
                      />
                    </View>
                    <View style={{flex: 1, marginLeft: 10}}>
                      <DatePickerComponent
                        date={
                          endDate
                            ? endDate.format('MMM DD, YYYY')
                            : moment().format('MMM DD, YYYY')
                        }
                        title={'To'}
                        onPress={() => setModalVisible(true)}
                      />
                    </View>
                  </View>
                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalCentered}>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.modalClose}>
                        <MaterialIcons
                          name={'close'}
                          size={20}
                          color={THEME.DARK_COLOR}
                        />
                      </TouchableOpacity>
                      <View style={styles.modalCalendarContainer}>
                        <CalendarPicker
                          testID={2}
                          startFromMonday={true}
                          allowRangeSelection={true}
                          minDate={minDate}
                          maxDate={maxDate}
                          todayTextStyle={THEME.WHITE_COLOR}
                          todayBackgroundColor={THEME.WHITE_COLOR}
                          selectedDayColor={THEME.PRIMARY_COLOR}
                          selectedDayTextColor="#fff"
                          width={WIDTH - 70}
                          onDateChange={setDatesRange}
                          previousComponent={
                            <MaterialIcons
                              name={'arrow-back-ios'}
                              size={20}
                              color={THEME.DARK_COLOR}
                            />
                          }
                          nextComponent={
                            <MaterialIcons
                              name={'arrow-forward-ios'}
                              size={20}
                              color={THEME.DARK_COLOR}
                            />
                          }
                        />
                      </View>
                    </View>
                  </Modal>
                </>
              )}
            </View>
          </View>
          <Divider style={styles.divider} />
          {/* Container for Line list */}
          <View style={{height: 350}}>
            <ListItem
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
                      handleAllLine();
                      setCheckAllLine(!checkAllLine);
                    }}
                  />
                </View>
              </ListItem.Content>
            </ListItem>
            <Divider style={styles.divider} />
            <ScrollView nestedScrollEnabled={true}>
              {lineData.length > 0 ? (
                lineData.map((item, i) => (
                  <Fragment key={item.id}>
                    <ListItem
                      key={i}
                      containerStyle={{
                        paddingLeft: 30,
                        backgroundColor: 'white',
                      }}
                      activeOpacity={1}
                      onPress={() => handleCheckedLine(item.id)}>
                      <ListItem.Content
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <ListItem.Title style={{color: THEME.DARK_COLOR}}>
                          {item.name}
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
                            onPress={() => handleCheckedLine(item.id)}
                          />
                        </View>
                      </ListItem.Content>
                    </ListItem>
                    <Divider style={styles.divider} />
                  </Fragment>
                ))
              ) : (
                <EmptyComponent
                  title={'You have no lines in your watch list'}
                />
              )}
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
            <ListItem
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
                      handleAllProduct();
                      setCheckAllProduct(!checkAllProduct);
                    }}
                  />
                </View>
              </ListItem.Content>
            </ListItem>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              data={productData}
              renderItem={renderProductItem}
              ListEmptyComponent={
                <EmptyComponent
                  title={'You have no product in your watch list'}
                />
              }
              removeClippedSubviews={true} // Unmount components when outside of window
              initialNumToRender={2} // Reduce initial render amount
              maxToRenderPerBatch={10} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={20}
              // ListFooterComponent={
              //   <ActivityIndicator size={30} color={THEME.PRIMARY_COLOR} />
              // }
            />
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
  modalCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalCalendarContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 4,
    elevation: 5,
  },
  modalClose: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 100,
    marginLeft: 'auto',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
