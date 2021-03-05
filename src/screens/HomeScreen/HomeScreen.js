import React, {useContext, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {ListItem, CheckBox} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import crashlytics from '@react-native-firebase/crashlytics';
import Clipboard from 'react-native-advanced-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import {AuthContext, UserContext} from '../../context/context';
import {useData} from '../../services/ApiService';

import HeaderStatus from '../../components/HeaderStatus';
import {CardComponent} from '../ReportScreen/components/CardComponent';
import IconBox from '../../components/icons/IconBox';
import {Btn} from '../../components/Button';
import {RBSheetHeader} from '../../components/RBSheetHeader';

import {sleep} from '../../utils/sleep';

export function HomeScreen({navigation}) {
  const user = useContext(UserContext);
  const {logout} = useContext(AuthContext);
  const {ApiService} = useData();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [nodeData, setNodeData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const refRBSheet = useRef();
  const numColumns = 2;
  //const WIDTH = Dimensions.get('window').width;

  useFocusEffect(
    useCallback(() => {
      crashlytics().log('Home mounted.');
      (async () => {
        await MaterialIcons.loadFont();
        await MaterialCommunityIcons.loadFont();
        console.log('home user data ', user);

        await fetchData();

        await AsyncStorage.getItem('favorites').then((favorite) => {
          let data = [];
          if (favorite !== null) {
            data = JSON.parse(favorite) || [];
          }
          console.log('data fffff', data);
          setFavorites(data);
        });
      })();

      console.log('favorites data', favorites);

      const refreshID = setInterval(async () => {
        await fetchData();
      }, 10000);

      return () => {
        clearInterval(refreshID);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]),
  );

  async function fetchData() {
    try {
      await ApiService.getLiveview().then(async ({data}) => {
        const nodes = data?.liveviewInfo;
        setNodeData(nodes);
      });
    } catch (e) {
      console.log('error message', e);
      logout();
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const refreshId = sleep(1000).then(async () => {
      await fetchData().then(() => {
        setRefreshing(false);
      });
    });
    return () => clearTimeout(refreshId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCard = ({item}) => (
    <CardComponent
      key={item.lineId}
      id={item.lineId}
      runId={item.runId}
      title={item.lineName}
      productName={item.productName}
      productDesc={item.productDescription}
      status={item.lineStatus}
      progressLine={item.lineTargetEfficiency}
      progressRun={item.runEfficiency}
      currentDowntimeDurationSeconds={item.currentDowntimeDurationSeconds}
      currentDowntimeStartTime={item.currentDowntimeStartTime}
      currentDowntimeStatus={item.currentDowntimeStatus}
      runDurationSeconds={item.runDurationSeconds}
      runStartTime={item.runStartTime}
      targetSpeed={item.targetSpeed}
      onPress={() =>
        navigation.navigate('CardDetail', {
          runId: item.runId,
        })
      }
    />
  );

  const handleChecked = async (idx) => {
    let data = [];
    await AsyncStorage.getItem('favorites').then((line) => {
      if (line) {
        data = JSON.parse(line);
      }
      console.log('logged', data, idx);
      console.log('logged true', data.indexOf(idx));
      if (data.indexOf(idx) === -1) {
        data.push(idx);
      } else {
        data = data.filter((item) => item !== idx);
      }
      AsyncStorage.setItem('favorites', JSON.stringify(data));
      setFavorites(data);
      console.log('saved', data);
    });

    let tempArr = [];
    nodeData.map((item) => {
      tempArr.push(item.lineId);
    });

    const includes = _.includes(data, tempArr);
    console.log('includes', includes);
    console.log('tempArr', tempArr);

    if (includes) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  const copyToClipboard = async () => {
    const tokenDevice = await AsyncStorage.getItem('tokenDevice');
    Clipboard.setString(tokenDevice);
  };

  const copyToClipboard2 = async () => {
    const tokenDevice = await AsyncStorage.getItem('tokenDeviceAPNs');
    Clipboard.setString(tokenDevice);
  };

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        {/*<TouchableOpacity onPress={copyToClipboard} style={{marginTop: 20}}>*/}
        {/*  <Text>Click here to copy to Token Device FCM </Text>*/}
        {/*</TouchableOpacity>*/}

        {/*<TouchableOpacity onPress={copyToClipboard2} style={{marginTop: 20}}>*/}
        {/*  <Text>Click here to copy to Token Device APN </Text>*/}
        {/*</TouchableOpacity>*/}

        <View style={styles.tabContainer}>
          <SegmentedControlTab
            values={['All lines', 'My line']}
            selectedIndex={selectedIndex}
            onTabPress={(index) => setSelectedIndex(index)}
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
            borderRadius={6}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            activeTabTextStyle={styles.activeTabTextStyle}
          />
        </View>
        {nodeData.length > 0 ? (
          selectedIndex === 0 ? (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 20,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              data={nodeData}
              numColumns={numColumns}
              horizontal={false}
              renderItem={renderCard}
              keyExtractor={(item) => item.lineId.toString()}
              refreshControl={
                <RefreshControl
                  tintColor={THEME.PRIMARY_COLOR}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          ) : (
            <View
              style={[
                styles.container,
                {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                },
              ]}>
              {/*{isVisible ? (*/}
              {/*  <>*/}
              {/*    <IconBox style={{marginTop: 'auto', marginBottom: 15}} />*/}
              {/*    <Text style={styles.subtitle}>*/}
              {/*      You have no lines in your watch list*/}
              {/*    </Text>*/}
              {/*  </>*/}
              {/*) : null}*/}
              <ScrollView
                style={[styles.containerScrollView, {paddingHorizontal: 10}]}
                refreshControl={
                  <RefreshControl
                    tintColor={THEME.PRIMARY_COLOR}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    height: '100%',
                    width: '100%',
                  }}>
                  {nodeData.map((item) => {
                    return favorites.indexOf(item.lineId) !== -1
                      ? renderCard({item})
                      : null;
                  })}
                </View>
              </ScrollView>
              <RBSheet
                ref={refRBSheet}
                closeOnDragDown={false}
                height={Platform.OS === 'ios' ? 500 : 400}
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
                  onPress={() => refRBSheet.current.close()}
                  title={'Edit List'}
                  iconName={'close'}
                />
                <ScrollView>
                  {nodeData.map((item) => (
                    <ListItem
                      key={item.lineId}
                      containerStyle={{
                        paddingLeft: 30,
                        backgroundColor: 'white',
                      }}
                      activeOpacity={1}
                      onPress={() => handleChecked(item.lineId)}>
                      <ListItem.Content
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <ListItem.Title style={{color: THEME.DARK_COLOR}}>
                          {item.lineName}
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
                            checked={favorites.indexOf(item.lineId) !== -1}
                            onPress={() => handleChecked(item.lineId)}
                          />
                        </View>
                      </ListItem.Content>
                    </ListItem>
                  ))}
                </ScrollView>
              </RBSheet>
              <View style={styles.containerBottom}>
                <Btn
                  size={THEME.BUTTON_PRIMARY_SMALL}
                  fontFamily={FONT.Regular}
                  title={'Edit List'}
                  icon={false}
                  backgroundColor={'transparent'}
                  textColorHover={THEME.WHITE_COLOR}
                  onPress={() => refRBSheet.current.open()}
                />
              </View>
            </View>
          )
        ) : (
          <View style={styles.noLineContainer}>
            <IconBox style={{marginBottom: 15}} />
            <Text style={styles.subtitle}>
              You have no lines in your watch list
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E5E5',
    height: '100%',
  },
  containerScrollView: {
    width: '100%',
  },
  text: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    fontFamily: FONT.SemiBold,
  },
  title: {
    fontSize: 22,
    fontFamily: FONT.SemiBold,
    color: THEME.PRIMARY_COLOR_DARK,
    marginBottom: 26,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PEW_COLOR,
    textAlign: 'center',
  },
  tabContainer: {
    padding: 16,
    paddingBottom: 5,
  },
  tabsContainerStyle: {
    height: 42,
    borderRadius: 6,
    padding: 5,
    backgroundColor: THEME.WHITE_COLOR,
  },
  tabStyle: {
    borderColor: THEME.WHITE_COLOR,
    borderRadius: 6,
  },
  tabTextStyle: {
    fontFamily: FONT.Regular,
    color: THEME.CHAR_COLOR,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  activeTabStyle: {
    backgroundColor: THEME.PRIMARY_COLOR_DARK,
    borderRadius: 6,
  },
  activeTabTextStyle: {
    color: '#fff',
  },
  containerBottom: {
    width: '100%',
    padding: 20,
    marginTop: 'auto',
    marginBottom: 0,
  },
  noLineContainer: {
    marginTop: 'auto',
    marginBottom: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
