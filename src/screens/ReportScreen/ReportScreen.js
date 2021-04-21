import React, {useContext, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Button,
} from 'react-native';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import crashlytics from '@react-native-firebase/crashlytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import _ from 'lodash';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import {useData} from '../../services/ApiService';
import {AuthContext} from '../../context/context';

import HeaderStatus from '../../components/HeaderStatus';
import {ProgressLine} from '../../components/ProgressLine';
import {ReportHeaderInfo} from './components/ReportHeaderInfo';
import {ReportHeaderFilter} from './components/ReportHeaderFilter';
import {CardEfficiency} from '../CardDetailsScreen/components/CardEfficiency';
import {ProgressContent} from '../../components/ProgressContent';
import IconBox from '../../components/icons/IconBox';
import {checkInternet} from '../../utils/checkInternet';

export function ReportScreen({navigation, route}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reportData, setReportData] = useState({});
  const [layoutData, setLayoutData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentIndexNegative, setCurrentIndexNegative] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [lineArray, setLineArray] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const [reportArray, setReportArray] = useState({});
  const [bottomActions, setBottomActions] = useState(null);
  const [filterDisabled, setFilterDisabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [isError, setIsError] = useState('');
  const {ApiService} = useData();
  const {refreshTokens, logout} = useContext(AuthContext);

  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClamp = Animated.diffClamp(scrollY, 0, 45);
  const inputRange = [0, 0];
  const outputRange = [0, 0];
  const HEIGHT = Dimensions.get('window').height;

  async function fetchProductData() {
    try {
      await ApiService.getProducts().then(async ({data}) => {
        const produtSelected = _.map(data, 'id');
        setProductArray(produtSelected);
      });
    } catch (e) {
      crashlytics().log('Filters error - product');
      crashlytics().recordError(e.message);
      setProductArray([]);
    }
  }

  async function fetchLineData() {
    try {
      await ApiService.getLines().then(async ({data}) => {
        const lineSelected = _.map(data, 'id');
        setLineArray(lineSelected);
      });
    } catch (e) {
      crashlytics().log('Filters error - line');
      crashlytics().recordError(e.message);
      setLineArray([]);
    }
  }

  let bool = _.isEmpty(route?.params?.filterData);

  useFocusEffect(
    useCallback(() => {
      checkInternet().then((res) => {
        setConnectionStatus(!res);
      });
      crashlytics().log('Report Screen mounted.');
      (async () => {
        await MaterialIcons.loadFont();
        await MaterialCommunityIcons.loadFont();
        setFilterDisabled(false);
        console.log('route.params', route.params);
        console.log('report filters 2 ', reportArray);
        if (!bool) {
          console.log('route.params 2', route.params);
          setLoading(true);
          console.log('setItem -----------', route?.params?.filterData);
          AsyncStorage.setItem(
            '@reportFilters',
            JSON.stringify(route?.params?.filterData),
          );
          const {
            filterData: {
              lineData,
              productData,
              date,
              dateFrom,
              dateTo,
              selectDay,
            },
          } = route.params;
          setReportArray(route?.params?.filterData);
          await fetchData(
            lineData,
            productData,
            date,
            dateFrom,
            dateTo,
            selectDay,
          );
        } else {
          await AsyncStorage.getItem('@reportFilters').then(
            async (dataReport) => {
              console.log('route.params 5', route.params);
              console.log('getItem -------------', JSON.parse(dataReport));
              if (dataReport !== null) {
                setLoading(true);
                const reportFilters = JSON.parse(dataReport);
                setReportArray(reportFilters);
                await fetchData(
                  reportFilters.lineData,
                  reportFilters.productData,
                  reportFilters.date,
                  reportFilters.dateFrom,
                  reportFilters.dateTo,
                  reportFilters.selectDay,
                );
                navigation.replace('ReportScreen', {
                  filterData: reportFilters,
                });
                setLoading(false);
                // navigation.reset({
                //   index: 0,
                //   routes: [
                //     {
                //       name: 'ReportScreen',
                //       params: {filterData: reportFilters},
                //     },
                //   ],
                // })

                // navigation.dispatch({
                //   ...CommonActions.setParams({filterData: reportFilters}),
                //   source: route.key,
                // });
              } else {
                setLoading(true);
                const yesterday = moment.utc()
                  .subtract(1, 'days')
                  .format('YYYY-MM-DDT12:00:00[.000Z]');
                const today = moment.utc().format('YYYY-MM-DDT12:00:00[.000Z]');
                await fetchProductData();
                await fetchLineData();
                await fetchData(
                  lineArray,
                  productArray,
                  today,
                  today,
                  today,
                  false,
                );
              }
            },
          );
        }
      })();
      return () => {
        console.log('logout vi');
        setProductArray([]);
        setLineArray([]);
        // setReportArray({});
        setCurrentIndex(null);
        setCurrentIndexNegative(null);
        setFilterDisabled(true);
        // setLoading(true);

        navigation.dispatch(
          CommonActions.setParams({
            filterData: {},
          }),
        );
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]),
  );

  async function fetchData(line, product, date, fromDate, toDate, selectDay) {
    const resData = {
      line_id_list: line,
      product_id_list: product,
      start_date: selectDay ? date : fromDate,
      end_date: selectDay ? date : toDate,
    };
    console.log('resData', resData);
    await ApiService.postReport(resData)
      .then(async ({data}) => {
        setFilterDisabled(true);
        setReportData(data);
        setLayoutData(data?.lostTimeList);
        setFilterDisabled(false);
      })
      .catch(async (err) => {
        const {status, data} = err.response;
        console.log('data', data);
        crashlytics().recordError(err);
        setIsError(data.error);
        if (status === 401) {
          console.log('data2 ', data);
          if (data.error === 'invalid_factory') {
            await logout();
          }
          if (data.error === 'token_expired') {
            await refreshTokens();
          }
        } else {
          setLoading(false);
          setReportData({});
          setLayoutData([]);
          // Toast.show({
          //   type: 'error',
          //   position: 'top',
          //   text1: data.error,
          //   topOffset: Platform.OS === 'ios' ? 80 : 30,
          //   visibilityTime: 1500,
          // // });
          // sleep(500).then(() => {
          //   if (data.error === 'Factory does not exist') {
          //     navigation.navigate('SelectFactoryTab');
          //   }
          // });
          if (data.error === 'Factory does not exist') {
            setFilterDisabled(true);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const renderHeaderPositive = (item, index, isExpanded = false) => {
    const result = layoutData.filter((list) => {
      return list.lostTimePercent > 0;
    });
    return (
      <ProgressLine
        index={index}
        title={item.reasonName}
        percent={item.lostTimePercent}
        isActive={isExpanded}
        sections={result}
      />
    );
  };

  const renderContentPositive = (item, index, isExpanded = true) => {
    return (
      // <Animated.View
      //   style={[
      //     styles.bottomActions,
      //     {
      //       transform: [
      //         {
      //           translateY: diffClamp.interpolate({
      //             inputRange: inputRange,
      //             outputRange: outputRange,
      //             extrapolate: 'clamp',
      //           }),
      //         },
      //       ],
      //     },
      //   ]}
      //   onLayout={(event) => {
      //     setBottomActions(event.nativeEvent.layout);
      //   }}>
      <ProgressContent
        index={index}
        isActive={isExpanded}
        title={item.reasonName}
        time={item.lostTimeSeconds}
        percent={item.lostTimePercent}
      />
      //</Animated.View>
    );
  };

  const renderHeaderNegative = (item, index, isExpanded = false) => {
    const result = layoutData.filter((list) => {
      return list.lostTimePercent < 0;
    });
    const resultSort = _.orderBy(result, ['lostTimePercent'], ['asc']);
    return (
      <ProgressLine
        index={index}
        title={item.reasonName}
        percent={item.lostTimePercent}
        isActive={isExpanded}
        sections={resultSort}
        backgroundColor={THEME.GREEN_COLOR}
      />
    );
  };

  const renderContentNegative = (item, index, isExpanded = true) => {
    return (
      <ProgressContent
        index={index}
        isActive={isExpanded}
        title={item.reasonName}
        time={item.lostTimeSeconds}
        percent={item.lostTimePercent}
      />
    );
  };

  const renderDataPositive = (data) => {
    const result = data.filter((item) => {
      return item.lostTimePercent > 0;
    });
    const resultSort = _.orderBy(result, ['lostTimePercent'], ['desc']);

    if (result.length > 0) {
      return resultSort.map((item, index) => (
        <TouchableOpacity
          onPress={() => {
            setCurrentIndex(index === currentIndex ? null : index);
          }}
          key={index}
          activeOpacity={1}>
          {renderHeaderPositive(item, index, index === currentIndex)}
          {currentIndex === index &&
            renderContentPositive(item, index, index === currentIndex)}
        </TouchableOpacity>
      ));
    } else {
      return <Text style={styles.textEmpty}>No data</Text>;
    }
  };

  const renderDataNegative = (data) => {
    const result = data.filter((item) => {
      return item.lostTimePercent < 0;
    });
    const resultSort = _.orderBy(result, ['lostTimePercent'], ['asc']);
    if (result.length > 0) {
      return resultSort.map((item, index) => (
        <TouchableOpacity
          onPress={() => {
            setCurrentIndexNegative(
              index === currentIndexNegative ? null : index,
            );
          }}
          key={index}
          activeOpacity={1}>
          {renderHeaderNegative(item, index, index === currentIndexNegative)}
          {currentIndexNegative === index &&
            renderContentNegative(item, index, index === currentIndexNegative)}
        </TouchableOpacity>
      ));
    } else {
      return <Text style={styles.textEmpty}>No data</Text>;
    }
  };

  if (connectionStatus) {
    return (
      <>
        <HeaderStatus ios={'light'} />
        <SafeAreaView style={styles.container}>
          <ReportHeaderFilter
            navigation={navigation}
            filterResult={undefined}
            disabled={true}
          />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        <ReportHeaderFilter
          navigation={navigation}
          filterResult={
            typeof route.params !== 'undefined'
              ? route.params?.filterData
              : reportArray
          }
          disabled={filterDisabled}
        />
        {/*<Button title={'refresh'} onPress={() => refreshTokens()} />*/}
        <Animated.ScrollView
          nestedScrollEnabled={true}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: true,
            },
          )}>
          {isLoading ? (
            <ActivityIndicator
              size={Platform.OS === 'android' ? 50 : 'large'}
              color={THEME.PRIMARY_COLOR}
              style={{marginTop: 200}}
            />
          ) : (
            <>
              <TouchableWithoutFeedback
                onPress={() => {
                  setCurrentIndex(null);
                  setCurrentIndexNegative(null);
                }}>
                {!_.isEmpty(reportData) ? (
                  <View>
                    <ReportHeaderInfo
                      navigation={navigation}
                      filtersData={
                        typeof route.params !== 'undefined'
                          ? route.params?.filterData
                          : reportArray
                      }
                      runData={reportData?.tableInfoList}
                    />
                    <View
                      style={[styles.block, {paddingBottom: 30, height: 220}]}>
                      <CardEfficiency
                        efficiencyPercent={reportData.efficiencyPercent}
                        efficiencyTarget={70}
                      />
                    </View>
                    <View
                      style={[
                        styles.block,
                        {paddingBottom: 30, marginBottom: 0, height: '100%'},
                      ]}>
                      <Text style={styles.label}>Downtime Pareto</Text>
                      <View style={styles.tabContainer}>
                        <SegmentedControlTab
                          values={['Lost Time', 'Gained Time']}
                          selectedIndex={selectedIndex}
                          onTabPress={(index) => {
                            setSelectedIndex(index);
                            setCurrentIndex(null);
                            setCurrentIndexNegative(null);
                          }}
                          tabsContainerStyle={styles.tabsContainerStyle}
                          tabStyle={styles.tabStyle}
                          firstTabStyle={styles.firstTabStyle}
                          borderRadius={0}
                          tabTextStyle={styles.tabTextStyle}
                          activeTabStyle={styles.activeTabStyle}
                          activeTabTextStyle={styles.activeTabTextStyle}
                        />
                      </View>
                      {selectedIndex === 0
                        ? renderDataPositive(layoutData)
                        : renderDataNegative(layoutData)}
                    </View>
                  </View>
                ) : (
                  <View
                    style={[styles.emptyContainer, {marginTop: HEIGHT / 3}]}>
                    <IconBox style={{marginBottom: 15}} />
                    <Text style={styles.subtitle}>{isError}</Text>
                  </View>
                )}
              </TouchableWithoutFeedback>
            </>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    position: 'relative',
    backgroundColor: THEME.WHITE_COLOR,
    padding: 30,
    paddingBottom: 0,
    borderColor: THEME.ASH_COLOR,
    marginBottom: 10,
  },
  label: {
    color: THEME.PEW_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 17,
    fontFamily: FONT.Medium,
    color: THEME.DARK_COLOR,
    marginBottom: 20,
  },
  textBlue: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PRIMARY_COLOR_DARK,
    marginBottom: 0,
  },
  divider: {
    backgroundColor: THEME.GRAY_COLOR,
    marginLeft: -30,
    marginRight: -30,
  },
  timeCol: {},
  timeBlock: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cardProgressRow: {
    position: 'relative',
    width: '100%',
    marginBottom: 6,
  },
  cardProgressLineHeadText: {
    position: 'absolute',
    top: -65,
    right: -22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardProgressLineMiddleText: {
    position: 'absolute',
    bottom: -65,
    right: -28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardProgressLineHead: {
    width: '50%',
    position: 'absolute',
    zIndex: 3,
    left: 0,
    top: 0,
    backgroundColor: THEME.PRIMARY_COLOR_DARK,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    height: 16,
  },
  cardProgressLineMiddle: {
    width: '80%',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    top: 3,
    backgroundColor: 'rgba(0, 68, 132, 0.4)',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    height: 10,
  },
  cardProgressLineFooter: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 3,
    backgroundColor: '#DDDDDD',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    height: 10,
  },
  tabContainer: {
    marginTop: 30,
    marginBottom: 30,
    padding: 0,
    paddingBottom: 5,
    backgroundColor: THEME.WHITE_COLOR,
  },
  tabsContainerStyle: {
    backgroundColor: THEME.WHITE_COLOR,
  },
  tabStyle: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: THEME.PEW_COLOR,
  },
  tabTextStyle: {
    fontFamily: FONT.SemiBold,
    color: THEME.PEW_COLOR,
    fontSize: 14,
  },
  firstTabStyle: {
    borderRightWidth: 0,
  },
  activeTabStyle: {
    backgroundColor: THEME.WHITE_COLOR,
    color: THEME.DANGER_COLOR,
    borderColor: THEME.DARK_COLOR,
    borderWidth: 0,
    borderBottomWidth: 2,
  },
  activeTabTextStyle: {
    color: THEME.DARK_COLOR,
  },
  accordionContainerStyle: {
    marginLeft: -30,
    marginRight: -30,
  },
  textEmpty: {
    textAlign: 'center',
    color: THEME.PRIMARY_COLOR,
  },
  bottomActions: {
    position: 'relative',
    width: '100%',
    zIndex: 99999,
    elevation: 99999,
    top: 0,
    left: 0,
    right: 0,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PEW_COLOR,
    textAlign: 'center',
  },
});
