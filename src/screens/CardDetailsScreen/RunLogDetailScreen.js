import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Divider} from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import crashlytics from '@react-native-firebase/crashlytics';
import _ from 'lodash';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import HeaderStatus from '../../components/HeaderStatus';
import {ProgressLine} from '../../components/ProgressLine';
import {ProgressContent} from '../../components/ProgressContent';
import {CardTitle} from './components/CardTitle';
import {CardProductTitle} from './components/CardProductTitle';
import {CardTime} from './components/CardTime';
import {CardOutput} from './components/CardOutput';
import {CardSpeed} from './components/CardSpeed';
import {CardEfficiency} from './components/CardEfficiency';

import {useData} from '../../services/ApiService';
import {sleep} from '../../utils/sleep';
import {CardProductDesc} from './components/CardProductDesc';

export function RunLogDetailScreen({navigation, route}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  //const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentIndexNegative, setCurrentIndexNegative] = useState(null);
  // const [runData, setRunData] = useState({});
  // const [layoutData, setLayoutData] = useState([]);
  // const {ApiService} = useData();

  const {runLogData} = route.params;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await MaterialIcons.loadFont();
        await MaterialCommunityIcons.loadFont();
        crashlytics().log('Run report - screen');

        setIsLoading(true);
        if (runLogData.runId) {
          setIsLoading(false);
          // await fetchData();
        } else {
          setIsLoading(false);
        }
      })();

      // const refreshID = setInterval(async () => {
      //   await fetchData();
      // }, 10000);

      return () => {
        // clearInterval(refreshID);
        setCurrentIndex(null);
        setCurrentIndexNegative(null);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // async function fetchData() {
  //   await ApiService.getByRunId(runId)
  //     .then(({data}) => {
  //       crashlytics().log('Get run report - get method');
  //       setRunData(data);
  //       setLayoutData(data?.lostTimeList);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       crashlytics().recordError(error.message);
  //       setIsLoading(true);
  //       navigation.goBack();
  //     });
  // }

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   const refreshId = sleep(1000).then(async () => {
  //     await fetchData().then(() => {
  //       setRefreshing(false);
  //     });
  //   });
  //   return () => clearTimeout(refreshId);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const renderHeaderPositive = (item, index, isExpanded = false) => {
    const result = runLogData.unitInfo.filter((list) => {
      return list.lostTimePercent > 0;
    });
    const resultSort = _.orderBy(result, ['lostTimePercent'], ['desc']);
    return (
      <ProgressLine
        key={index + Math.random()}
        index={index}
        title={item.reasonName}
        percent={item.lostTimePercent}
        isActive={isExpanded}
        sections={resultSort}
      />
    );
  };

  const renderContentPositive = (item, index, isExpanded = true) => {
    return (
      <ProgressContent
        key={index + Math.random()}
        index={index}
        isActive={isExpanded}
        title={item.reasonName}
        time={item.lostTimeSeconds}
        percent={item.lostTimePercent}
      />
    );
  };

  const renderHeaderNegative = (item, index, isExpanded = false) => {
    const result = runLogData.unitInfo.filter((list) => {
      return list.lostTimePercent < 0;
    });
    const resultSort = _.orderBy(result, ['lostTimePercent'], ['asc']);
    return (
      <ProgressLine
        key={index + Math.random()}
        index={index}
        title={item.reasonName}
        percent={item.lostTimePercent}
        isActive={isExpanded}
        backgroundColor={THEME.GREEN_COLOR}
        sections={resultSort}
      />
    );
  };

  const renderContentNegative = (item, index, isExpanded = true) => {
    return (
      <ProgressContent
        key={index + Math.random()}
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
          {currentIndex === index
            ? renderContentPositive(item, index, index === currentIndex)
            : null}
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
          {currentIndexNegative === index
            ? renderContentNegative(item, index, index === currentIndexNegative)
            : null}
        </TouchableOpacity>
      ));
    } else {
      return <Text style={styles.textEmpty}>No data</Text>;
    }
  };

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator
            size={50}
            color={THEME.PRIMARY_COLOR_DARK}
            style={{marginTop: 'auto', marginBottom: 'auto'}}
          />
        ) : (
          <ScrollView
            ref={(ref) => {
              console.log('ref', ref);
            }}
            style={styles.container}
            onContentSizeChange={(contentWidth, contentHeight) => {
              console.log('contentHeight', contentHeight);
            }}
            // refreshControl={
            //   <RefreshControl
            //     tintColor={THEME.PRIMARY_COLOR}
            //     refreshing={refreshing}
            //     onRefresh={onRefresh}
            //   />
            // }
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setCurrentIndex(null);
                setCurrentIndexNegative(null);
              }}>
              <View>
                <View style={styles.block}>
                  <CardTitle title={runLogData?.lineName} />
                  <CardProductTitle title={runLogData?.productName} />
                  <CardProductDesc description={runLogData?.productDescription} />
                  <Divider style={styles.divider} />
                  <CardTime
                    startTime={runLogData?.runStartTime}
                    endTime={runLogData?.runEndTime}
                  />
                </View>
                <View
                  style={[styles.block, {paddingBottom: 30, marginBottom: 0}]}>
                  <CardOutput
                    title={runLogData?.output}
                    unit={runLogData?.displayableOutputUnit}
                  />
                </View>
                <Divider style={styles.divider} />
                <View
                  style={[styles.block, {paddingBottom: 30, marginBottom: 0}]}>
                  <CardSpeed
                    speed={runLogData?.averageSpeed}
                    unit={runLogData?.displayableSpeedUnit}
                  />
                </View>
                <Divider style={styles.divider} />
                <View style={[styles.block, {paddingBottom: 30, height: 220}]}>
                  <CardEfficiency
                    efficiencyPercent={runLogData?.efficiencyPercent}
                    efficiencyTarget={runLogData?.efficiencyTarget}
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
                    ? renderDataPositive(runLogData.unitInfo)
                    : renderDataNegative(runLogData.unitInfo)}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    height: '100%',
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
  divider: {
    backgroundColor: THEME.GRAY_COLOR,
    marginLeft: -30,
    marginRight: -30,
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
