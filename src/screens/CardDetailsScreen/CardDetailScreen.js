import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Divider} from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import _ from 'lodash';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import HeaderStatus from '../../components/HeaderStatus';
import IconArrow from '../../components/icons/IconArrow';
import IconCubes from '../../components/icons/IconCubes';
import {ProgressLine} from '../../components/ProgressLine';

import {useData} from '../../services/ApiService';
import {ProgressContent} from '../../components/ProgressContent';

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
                <Text style={styles.label}>Line</Text>
                <Text
                  style={styles.text}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {runData?.lineName}
                </Text>
                <Text style={styles.label}>Product</Text>
                <Text
                  style={styles.text}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {runData?.productName}
                </Text>
                <Divider style={styles.divider} />
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      borderRightWidth: 1,
                      borderColor: THEME.GRAY_COLOR,
                      paddingTop: 20,
                      paddingBottom: 30,
                    }}>
                    <Text style={styles.label}>Start time</Text>
                    <View style={styles.timeBlock}>
                      <MaterialCommunityIcons
                        size={20}
                        color={THEME.PRIMARY_COLOR_DARK}
                        name={'clock-time-four-outline'}
                        style={{marginRight: 10}}
                      />
                      <Text style={styles.textBlue}>
                        {moment(runData?.runStartTime).format('h:mm:ss a')}
                      </Text>
                    </View>
                  </View>
                  <View style={{flex: 1, marginLeft: 20, paddingTop: 20}}>
                    <Text style={styles.label}>End time</Text>
                    <View style={styles.timeBlock}>
                      <MaterialCommunityIcons
                        size={20}
                        color={THEME.PRIMARY_COLOR_DARK}
                        name={'clock-time-four-outline'}
                        style={{marginRight: 10}}
                      />
                      <Text style={styles.textBlue}>
                        {moment(runData?.runEndTime).format('h:mm:ss a')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={[styles.block, {paddingBottom: 30, marginBottom: 0}]}>
                <Text style={styles.label}>OUTPUT</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <IconCubes style={{marginRight: 20}} />
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: FONT.Medium,
                      color: THEME.PRIMARY_COLOR_DARK,
                      marginRight: 10,
                    }}>
                    {runData?.output}
                  </Text>
                  <Text style={styles.textBlue}>
                    {runData?.displayableOutputUnit}
                  </Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <View
                style={[styles.block, {paddingBottom: 30, marginBottom: 0}]}>
                <Text style={styles.label}>Speed</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <MaterialIcons
                    name={'speed'}
                    size={35}
                    color={THEME.PRIMARY_COLOR_DARK}
                    style={{marginRight: 20}}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: FONT.Medium,
                      color: THEME.PRIMARY_COLOR_DARK,
                      marginRight: 10,
                    }}>
                    {_.floor(runData?.averageSpeed, 1)}
                  </Text>
                  <Text style={styles.textBlue}>
                    {runData?.displayableSpeedUnit}
                  </Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <View style={[styles.block, {paddingBottom: 30, height: 220}]}>
                <Text style={styles.label}>EFFICIENCY</Text>
                <View
                  style={{
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <View style={[styles.cardProgressRow, {marginTop: 65}]}>
                    <View
                      style={[
                        styles.cardProgressLineHead,
                        {width: `${_.floor(runData?.efficiencyPercent, 1)}%`},
                      ]}>
                      <View style={styles.cardProgressLineHeadText}>
                        <Text style={styles.textBlue}>OEE</Text>
                        <Text
                          style={{
                            fontSize: 22,
                            fontFamily: FONT.Medium,
                            color: THEME.PRIMARY_COLOR_DARK,
                            marginTop: Platform.OS === 'ios' ? 0 : -10,
                          }}>
                          {_.floor(runData?.efficiencyPercent, 1)}%
                        </Text>
                        <IconArrow
                          height={10}
                          width={10}
                          fill={THEME.DANGER_COLOR}
                          style={{
                            marginTop: Platform.OS === 'ios' ? 1 : -8,
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.cardProgressLineMiddle,
                        {width: `${_.floor(runData?.efficiencyTarget, 1)}%`},
                      ]}>
                      <View style={styles.cardProgressLineMiddleText}>
                        <IconArrow
                          height={10}
                          width={10}
                          fill={'rgba(0, 68, 132, 0.4)'}
                          style={{
                            marginTop: Platform.OS === 'ios' ? 0 : -7,
                            transform: [{rotate: '180deg'}],
                          }}
                        />
                        <Text
                          style={[
                            styles.textBlue,
                            {
                              color: 'rgba(0, 68, 132, 0.4)',
                              marginTop: Platform.OS === 'ios' ? 0 : 0,
                            },
                          ]}>
                          TARGET
                        </Text>
                        <Text
                          style={{
                            fontSize: 22,
                            fontFamily: FONT.Medium,
                            color: 'rgba(0, 68, 132, 0.4)',
                            marginTop: Platform.OS === 'ios' ? 0 : -15,
                          }}>
                          {_.floor(runData?.efficiencyTarget, 1)}%
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardProgressLineFooter} />
                  </View>
                </View>
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
});
