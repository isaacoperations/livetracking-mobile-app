import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Divider} from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

export function CardDetailScreen({route}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSections, setActiveSections] = useState([]);
  const [runData, setRunData] = useState({});
  const {LiveView} = useData();

  const {runId} = route.params;

  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
      await MaterialCommunityIcons.loadFont();

      setIsLoading(true);
      if (runId) {
        await LiveView.getByLineId(runId)
          .then(({data}) => {
            console.log('response run data', data);
            setRunData(data);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(true);
            console.log('error run', error);
          });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderHeader = (content, index, isActive) => {
    return (
      <ProgressLine
        title={content.reasonName}
        percent={content.lostTimePercent}
        isActive={isActive}
      />
    );
  };

  const renderContent = (section) => {
    return (
      <ProgressContent
        title={section.reasonName}
        info={section.reasonName}
        percent={section.lostTimePercent}
      />
    );
  };

  const updateSections = (items) => {
    setActiveSections(items);
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
          <ScrollView style={styles.container}>
            <View>
              <View style={styles.block}>
                <CardTitle title={runData?.lineName} />
                <CardProductTitle title={runData?.productName} />
                <Divider style={styles.divider} />
                <CardTime startTime={runData?.runStartTime} endTime={runData?.runEndTime} />
              </View>
              <View style={[styles.block, {paddingBottom: 30, marginBottom: 0}]}>
                <CardOutput title={runData?.output} unit={runData?.displayableOutputUnit} />
              </View>
              <Divider style={styles.divider} />
              <View style={[styles.block, {paddingBottom: 30, marginBottom: 0}]}>
                <CardSpeed speed={runData?.averageSpeed} unit={runData?.displayableSpeedUnit} />
              </View>
              <Divider style={styles.divider} />
              <View style={[styles.block, {paddingBottom: 30, height: 220}]}>
                <CardEfficiency efficiencyPercent={runData?.efficiencyPercent} efficiencyTarget={runData?.efficiencyTarget} />
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
                {selectedIndex === 0 ? (
                  <Accordion
                    sections={runData?.lostTimeList}
                    activeSections={activeSections}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    onChange={updateSections}
                    underlayColor={'transparent'}
                    containerStyle={styles.accordionContainerStyle}
                  />
                ) : (
                  <Text>Not effect</Text>
                )}
              </View>
            </View>
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
});
