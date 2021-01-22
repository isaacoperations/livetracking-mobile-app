import React, {useContext, useEffect, useState, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  FlatList,
  Pressable,
} from 'react-native';
import {Divider} from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import HeaderStatus from '../../components/HeaderStatus';

import {UserContext} from '../../context/context';
import IconCubes from '../../components/IconCubes';
import {ProgressLine} from '../../components/ProgressLine';

const cardList = [
  {
    id: 1,
    title: 'Ippolito DXM Node 1',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'success',
    progress: 85,
    isChecked: false,
  },
];

const progressList = [
  {
    id: 1,
    title: 'Slow Running',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 100,
    isShow: false,
  },
  {
    id: 2,
    title: 'Break / Lunch',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 90,
    isShow: false,
  },
  {
    id: 3,
    title: 'No Feed',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 80,
    isShow: false,
  },
  {
    id: 4,
    title: 'Uncategorized',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 70,
    isShow: false,
  },
  {
    id: 5,
    title: 'Changeover',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 60,
    isShow: false,
  },
  {
    id: 6,
    title: 'Short Stop',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 50,
    isShow: false,
  },
  {
    id: 7,
    title: 'Cleaning',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 40,
    isShow: false,
  },
  {
    id: 8,
    title: 'Slow Startup',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 30,
    isShow: false,
  },
  {
    id: 9,
    title: 'Gap',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 20,
    isShow: false,
  },
  {
    id: 10,
    title: 'Printing',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 10,
    isShow: false,
  },
];

const progressList2 = [
  {
    id: 1,
    title: 'Uncategorized',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 100,
    isShow: false,
  },
  {
    id: 2,
    title: 'Uncategorized 2',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ',
    percent: 90,
    isShow: false,
  },
];

export function CardDetailScreenReport({navigation}) {
  const user = useContext(UserContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progressShown, setProgressShown] = useState(0);
  const [progressShown2, setProgressShown2] = useState(0);
  const [progressOpacity, setProgressOpacity] = useState(true);
  const [progressOpacity2, setProgressOpacity2] = useState(true);

  useEffect(() => {
    console.log('home user', user?.token);
    (async () => {
      await MaterialIcons.loadFont();
      await MaterialCommunityIcons.loadFont();
      await Entypo.loadFont();
    })();
  }, []);

  const toggleProgress = (id) => {
    let data = progressList.slice();
    const index = data.findIndex((x) => x.id === id);
    data[index].isShow = !data[index].isShow;
    setProgressShown(index + 1);
    setProgressOpacity(!progressOpacity);
    console.log(progressShown);
  };

  const toggleProgress2 = (id) => {
    let data = progressList2.slice();
    const index = data.findIndex((x) => x.id === id);
    data[index].isShow = !data[index].isShow;
    console.log(index);
    setProgressShown2(index + 1);
    setProgressOpacity2(!progressOpacity2);
    console.log(progressShown2);
  };

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <View>
            <View style={styles.block}>
              <Text style={styles.label}>Line</Text>
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                Ippolito DXM Node 1
              </Text>
              <Text style={styles.label}>Product</Text>
              <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
                Blueberry Muffins w/ whole wheat flour
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
                    <Text style={styles.textBlue}>1:07:11 PM</Text>
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
                    <Text style={styles.textBlue}>4:33:22 PM</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.block, {paddingBottom: 30, marginBottom: 0}]}>
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
                  23
                </Text>
                <Text style={styles.textBlue}>cases</Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={[styles.block, {paddingBottom: 30, marginBottom: 0}]}>
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
                  79
                </Text>
                <Text style={styles.textBlue}>pkg/min</Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={[styles.block, {paddingBottom: 30, height: 190}]}>
              <Text style={styles.label}>EFFICIENCY</Text>
              <View
                style={{
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <View style={[styles.cardProgressRow, {marginTop: 35}]}>
                  <View style={styles.cardProgressLineHead}>
                    <View style={styles.cardProgressLineHeadText}>
                      <Text style={styles.textBlue}>OEE</Text>
                      <Text
                        style={{
                          fontSize: 22,
                          fontFamily: FONT.Medium,
                          color: THEME.PRIMARY_COLOR_DARK,
                          marginTop: Platform.OS === 'ios' ? 0 : -10,
                        }}>
                        51%
                      </Text>
                      <Entypo
                        name={'triangle-down'}
                        size={20}
                        color={THEME.DANGER_COLOR}
                        style={{
                          marginTop: Platform.OS === 'ios' ? 0 : -13,
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.cardProgressLineMiddle}>
                    <View style={styles.cardProgressLineMiddleText}>
                      <Entypo
                        name={'triangle-up'}
                        size={20}
                        color={'rgba(0, 68, 132, 0.4)'}
                        style={{
                          marginBottom: Platform.OS === 'ios' ? 0 : -7,
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
                        72%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardProgressLineFooter} />
                </View>
              </View>
            </View>
            <View style={[styles.block, {paddingBottom: 30, marginBottom: 0, height: '100%'}]}>
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
                ? progressList.map((item) => {
                    return progressShown === item.id ? (
                      <Fragment key={item.id}>
                        <Pressable
                          onPress={() => toggleProgress(item.id)}
                          activeOpacity={0.8}>
                          <ProgressLine
                            title={item.title}
                            percent={item.percent}
                            opacity={1}
                            info={item.description}
                            show={item.isShow}
                          />
                        </Pressable>
                      </Fragment>
                    ) : (
                      <Fragment key={item.id}>
                        <Pressable
                          disabled={!progressOpacity}
                          onPress={() => toggleProgress(item.id)}
                          activeOpacity={0.8}>
                          <ProgressLine
                            title={item.title}
                            percent={item.percent}
                            opacity={progressOpacity ? 1 : 0.3}
                            info={item.description}
                            show={item.isShow}
                          />
                        </Pressable>
                      </Fragment>
                    );
                  })
                : progressList2.map((item) => {
                    return progressShown2 === item.id ? (
                      <Fragment key={item.id}>
                        <Pressable
                          onPress={() => toggleProgress2(item.id)}
                          activeOpacity={0.8}>
                          <ProgressLine
                            title={item.title}
                            percent={item.percent}
                            opacity={1}
                            info={item.description}
                            show={item.isShow}
                            backgroundColor={THEME.GREEN_COLOR}
                          />
                        </Pressable>
                      </Fragment>
                    ) : (
                      <Fragment key={item.id}>
                        <Pressable
                          disabled={!progressOpacity2}
                          onPress={() => toggleProgress2(item.id)}
                          activeOpacity={0.8}>
                          <ProgressLine
                            title={item.title}
                            percent={item.percent}
                            opacity={progressOpacity2 ? 1 : 0.3}
                            info={item.description}
                            show={item.isShow}
                            backgroundColor={THEME.GREEN_COLOR}
                          />
                        </Pressable>
                      </Fragment>
                    );
                  })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 30 : 20,
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
    right: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardProgressLineMiddleText: {
    position: 'absolute',
    bottom: -65,
    right: -25,
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
});
