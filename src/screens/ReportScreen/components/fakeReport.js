import React, {
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  Fragment,
} from 'react';
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
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import crashlytics from '@react-native-firebase/crashlytics';
// import {AccordionList} from 'accordion-collapse-react-native';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import _ from 'lodash';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

import {useData} from '../../../services/ApiService';
import {AuthContext} from '../../../context/context';

import HeaderStatus from '../../../components/HeaderStatus';
import {ProgressLine} from '../../../components/ProgressLine';
import {ReportHeaderInfo} from './../components/ReportHeaderInfo';
import {ReportHeaderFilter} from './../components/ReportHeaderFilter';
import {CardEfficiency} from '../../CardDetailsScreen/components/CardEfficiency';
import {ProgressContent} from '../../../components/ProgressContent';

export function FakeReportScreen({navigation, route}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reportData, setReportData] = useState({});
  const [layoutData, setLayoutData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [lineArray, setLineArray] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const [bottomActions, setBottomActions] = useState(null);
  const {ApiService} = useData();
  const {refreshTokens} = useContext(AuthContext);

  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClamp = Animated.diffClamp(scrollY, 0, 45);
  const inputRange = [0, 0];
  const outputRange = [0, 0];

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
      await refreshTokens();
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
      await refreshTokens();
    }
  }

  let bool = _.isEmpty(route?.params?.filterData);

  useFocusEffect(
    useCallback(() => {
      crashlytics().log('Report Screen mounted.');
      (async () => {
        await MaterialIcons.loadFont();
        await MaterialCommunityIcons.loadFont();
        if (!bool) {
          setLoading(true);
          const {
            filterData: {lineData, productData, date, dateFrom, dateTo},
          } = route.params;
          await fetchData(lineData, productData, date, dateFrom, dateTo);
        } else {
          setLoading(true);
          const yesterday = moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[.000Z]');
          const today = moment().format('YYYY-MM-DDTHH:mm:ss[.000Z]');
          await fetchProductData();
          await fetchLineData();
          await fetchData(lineArray, productArray, today, yesterday, today);
        }
      })();
      return () => {
        console.log('logout vi');
        setProductArray([]);
        setLineArray([]);
        setLoading(true);
        navigation.setParams({filterData: undefined});
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]),
  );

  async function fetchData(line, product, date, fromDate, toDate) {
    const resData = {
      line_id_list: line,
      product_id_list: product,
      start_date: fromDate,
      end_date: toDate,
    };
    await ApiService.postReport(resData)
      .then(async ({data}) => {
        setLoading(false);
        setReportData(data);
        setLayoutData(data?.lostTimeList);
      })
      .catch(async (err) => {
        const {status, data} = err.response;
        crashlytics().recordError(err);
        if (status === 401) {
          await refreshTokens();
        } else {
          setLoading(true);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: data.error,
            topOffset: Platform.OS === 'ios' ? 80 : 30,
            visibilityTime: 1500,
          });
          // fetchData();
        }
      });
  }

  const renderHeaderPositive = (item, index, isExpanded = false) => {
    const result = layoutData.filter((list) => {
      return list.lostTimePercent > 0;
    });
    return (
      <ProgressLine
        index={index}
        title={item.reasonName || item}
        percent={item.lostTimePercent}
        isActive={isExpanded}
        sections={result}
      />
    );
  };

  const renderContentPositive = (item, index, isExpanded = false) => {
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

  const renderHeaderNegative = (item, index, isExpanded) => {
    const result = layoutData.filter((list) => {
      return list.lostTimePercent < 0;
    });
    return (
      <ProgressLine
        index={index}
        title={item.reasonName}
        percent={item.lostTimePercent}
        isActive={isExpanded}
        sections={result}
        backgroundColor={THEME.GREEN_COLOR}
      />
    );
  };

  const renderContentNegative = (item, index, isExpanded) => {
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

  // const renderDataPositive = (data) => {
  //   const result = data.filter((item) => {
  //     return item.lostTimePercent > 0;
  //   });
  //   const resultSort = _.orderBy(result, ['lostTimePercent'], ['desc']);
  //   if (result.length > 0) {
  //     return (
  //       <AccordionList
  //         list={resultSort}
  //         header={renderHeaderPositive}
  //         body={renderContentPositive}
  //         keyExtractor={(item) => `${item.reasonName}`}
  //       />
  //     );
  //   } else {
  //     return <Text style={styles.textEmpty}>No effect data</Text>;
  //   }
  // };
  //
  // const renderDataNegative = (data) => {
  //   const result = data.filter((item) => {
  //     return item.lostTimePercent < 0;
  //   });
  //   const resultSort = _.orderBy(result, ['lostTimePercent'], ['desc']);
  //   if (result.length > 0) {
  //     return (
  //       <AccordionList
  //         list={resultSort}
  //         header={renderHeaderNegative}
  //         body={renderContentNegative}
  //         keyExtractor={(item) => `${item.reasonName}`}
  //       />
  //     );
  //   } else {
  //     return <Text style={styles.textEmpty}>No effect data</Text>;
  //   }
  // };

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const updateLayout = (index, close = true, sort = true) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let resultSort;
    if (sort) {
      const result = layoutData.filter((item) => {
        return item.lostTimePercent > 0;
      });
      resultSort = _.orderBy(result, ['lostTimePercent'], ['desc']);
    } else {
      const result = layoutData.filter((item) => {
        return item.lostTimePercent < 0;
      });
      resultSort = _.orderBy(result, ['lostTimePercent'], ['desc']);
    }
    const array = [...resultSort];
    if (close) {
      array.map((value, placeIndex) => {
        placeIndex === index
          ? (array[placeIndex].isExpanded = !array[placeIndex].isExpanded)
          : (array[placeIndex].isExpanded = false);
      });
    } else {
      array.map((value, placeIndex) => {
        array[placeIndex].isExpanded = false;
      });
    }
    setLayoutData(array);
  };

  const ExpandedComponentPositive = ({item, index, onPress}) => {
    const [layoutHeight, setLayoutHeight] = useState(0);

    useEffect(() => {
      if (item.isExpanded) {
        setLayoutHeight(null);
      } else {
        setLayoutHeight(0);
      }
    }, [item.isExpanded]);

    return (
      <Fragment key={index}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {renderHeaderPositive(item, index, !item.isExpanded)}
        </TouchableOpacity>
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
          }}>
          {renderContentPositive(item, index, !item.isExpanded)}
        </View>
      </Fragment>
    );
  };

  const ExpandedComponentNegative = ({item, index, onPress}) => {
    const [layoutHeight, setLayoutHeight] = useState(0);

    useEffect(() => {
      if (item.isExpanded) {
        setLayoutHeight(null);
      } else {
        setLayoutHeight(0);
      }
    }, [item.isExpanded]);

    return (
      <Fragment key={index}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {renderHeaderNegative(item, index, !item.isExpanded)}
        </TouchableOpacity>
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
          }}>
          {renderContentNegative(item, index, !item.isExpanded)}
        </View>
      </Fragment>
    );
  };

  const CollapseComponentPositive = (data) => {
    const result = data.filter((item) => {
      return item.lostTimePercent > 0;
    });
    const resultSort = _.orderBy(result, ['lostTimePercent'], ['desc']);
    if (resultSort.length > 0) {
      return resultSort.map((item, index) => (
        <ExpandedComponentPositive
          key={index}
          item={item}
          index={index}
          onPress={() => updateLayout(index)}
        />
      ));
    } else {
      return <Text style={styles.textEmpty}>No effect's</Text>;
    }
  };

  const CollapseComponentNegative = (data) => {
    const result = data.filter((item) => {
      return item.lostTimePercent < 0;
    });
    const resultSort = _.orderBy(result, ['lostTimePercent'], ['desc']);
    if (resultSort.length > 0) {
      return resultSort.map((item, index) => (
        <ExpandedComponentNegative
          key={index}
          item={item}
          index={index}
          onPress={() => updateLayout(index, true, false)}
        />
      ));
    } else {
      return <Text style={styles.textEmpty}>No effect's</Text>;
    }
  };

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        <ReportHeaderFilter
          navigation={navigation}
          filterResult={
            typeof route.params !== 'undefined' ? route.params?.filterData : {}
          }
          allProducts={productArray}
          allLines={lineArray}
        />

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
              <TouchableWithoutFeedback onPress={() => updateLayout(0, false)}>
                <View>
                  <ReportHeaderInfo
                    navigation={navigation}
                    filtersData={
                      typeof route.params !== 'undefined'
                        ? route.params?.filterData
                        : {}
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
                          updateLayout(0, false);
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
                      ? CollapseComponentPositive(layoutData)
                      : CollapseComponentNegative(layoutData)}
                  </View>
                </View>
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
});
