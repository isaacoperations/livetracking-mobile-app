import React, {useContext, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import crashlytics from '@react-native-firebase/crashlytics';
import Accordion from 'react-native-collapsible/Accordion';
import Toast from 'react-native-toast-message';
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

export function ReportScreen({navigation, route}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeSectionsPositive, setActiveSectionsPositive] = useState([]);
  const [activeSectionsNegative, setActiveSectionsNegative] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const {ApiService} = useData();
  const {logout} = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      crashlytics().log('Report Screen mounted.');
      (async () => {
        await MaterialIcons.loadFont();
        await MaterialCommunityIcons.loadFont();

        if (typeof route.params !== 'undefined') {
          setLoading(true);
          const {
            filterData: {lineData, productData, date, dateFrom, dateTo},
          } = route.params;
          console.log(
            'filterData -------- 1',
            lineData,
            productData,
            date,
            dateFrom,
            dateTo,
          );
          await fetchData(lineData, productData, date, dateFrom, dateTo);
        } else {
          console.log('filterData -------- 0');
          await fetchData();
        }
      })();

      return () => {
        setActiveSectionsPositive([]);
        setActiveSectionsNegative([]);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]),
  );

  const yesterday = moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DDTHH:mm:ss[.000Z]');
  const today = moment().format('YYYY-MM-DDTHH:mm:ss[.000Z]');

  async function fetchData(
    line = null,
    product = null,
    date = today,
    fromDate = yesterday,
    toDate = today,
  ) {
    const resData = {
      line_id_list: line,
      product_id_list: product,
      start_date: fromDate,
      end_date: toDate,
    };
    console.log('resDataresData', resData);
    await ApiService.postReport(resData)
      .then(async ({data}) => {
        setLoading(false);
        setReportData(data);
        console.log('reportData 111', data);
      })
      .catch((err) => {
        const {status, data} = err.response;
        console.log('datadatadata', data);
        if (status === 401) {
          logout();
        } else {
          setLoading(true);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: data.error,
            topOffset: Platform.OS === 'ios' ? 80 : 30,
            visibilityTime: 1500,
          });
        }
      });
  }

  const renderHeaderPositive = (content, index, isActive, sections) => {
    return (
      <ProgressLine
        index={index}
        title={content.reasonName}
        percent={content.lostTimePercent}
        isActive={isActive}
        sections={sections}
      />
    );
  };

  const renderContentPositive = (content, index, isActive) => {
    return (
      <ProgressContent
        index={index}
        isActive={isActive}
        title={content.reasonName}
        time={content.lostTimeSeconds}
        percent={content.lostTimePercent}
      />
    );
  };

  const renderHeaderNegative = (content, index, isActive, sections) => {
    return (
      <ProgressLine
        index={index}
        title={content.reasonName}
        percent={content.lostTimePercent}
        isActive={isActive}
        backgroundColor={THEME.GREEN_COLOR}
        sections={sections}
      />
    );
  };

  const renderContentNegative = (content, index, isActive) => {
    return (
      <ProgressContent
        index={index}
        isActive={isActive}
        title={content.reasonName}
        time={content.lostTimeSeconds}
        percent={content.lostTimePercent}
      />
    );
  };

  const updateSectionsPositive = (items) => {
    console.log('updateSectionsPositive', items);
    setActiveSectionsPositive(items);
  };

  const updateSectionsNegative = (items) => {
    setActiveSectionsNegative(items);
  };

  const renderDataPositive = (data) => {
    const result = data.filter((item) => {
      return item.lostTimePercent >= 0;
    });
    if (result.length > 0) {
      return (
        <Accordion
          sections={result}
          activeSections={activeSectionsPositive}
          renderHeader={renderHeaderPositive}
          renderContent={renderContentPositive}
          onChange={updateSectionsPositive}
          underlayColor={'transparent'}
          containerStyle={styles.accordionContainerStyle}
        />
      );
    } else {
      return <Text style={styles.textEmpty}>No effect data</Text>;
    }
  };

  const renderDataNegative = (data) => {
    const result = data.filter((item) => {
      return item.lostTimePercent <= 0;
    });
    if (result.length > 0) {
      return (
        <Accordion
          sections={result}
          activeSections={activeSectionsNegative}
          renderHeader={renderHeaderNegative}
          renderContent={renderContentNegative}
          onChange={updateSectionsNegative}
          underlayColor={'transparent'}
          containerStyle={styles.accordionContainerStyle}
        />
      );
    } else {
      return <Text style={styles.textEmpty}>No effect data</Text>;
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
        />
        <ScrollView>
          {isLoading ? (
            <ActivityIndicator
              size={50}
              color={THEME.PRIMARY_COLOR}
              style={{marginTop: 200}}
            />
          ) : (
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
              <View style={[styles.block, {paddingBottom: 30, height: 220}]}>
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
                    values={['Positive effect', 'Negative effect']}
                    selectedIndex={selectedIndex}
                    onTabPress={(index) => setSelectedIndex(index)}
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
                  ? renderDataPositive(reportData?.lostTimeList || [])
                  : renderDataNegative(reportData?.lostTimeList || [])}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
