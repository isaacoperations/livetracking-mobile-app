import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ListItem, CheckBox} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import crashlytics from '@react-native-firebase/crashlytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
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
import {checkInternet} from '../../utils/checkInternet';
import {encryptHex} from '../../utils/encrypt';

export function HomeScreen({navigation}) {
  const user = useContext(UserContext);
  const {refreshTokens} = useContext(AuthContext);
  const {ApiService} = useData();
  const organizations =
    user.userData['https://livetracking.ca/app_metadata'].organizations;
  const factoriesData = user.app_metadata?.factories[0]?.id;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [factoryIds, setFactoryIds] = useState(factoriesData || '');
  const [nodeData, setNodeData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const refRBSheet = useRef();
  const numColumns = 2;

  useEffect(() => {
    (async () => {
      crashlytics().log('Home mounted.');
      const tokenFB = await AsyncStorage.getItem('tokenDevice');
      // const data = {
      //   user_data: user,
      //   firebase_token: tokenFB,
      //   device: Platform.OS === 'ios' ? 'IOS' : 'Android',
      // };

      // const data = {
      //   user_id: user.userData.sub,
      // };
      //
      // const re =
      //   '{"messages": [{"date": "2021-04-13T11:23:33.688440Z", "title": "its work", "body": "Lorey was here"}, {"date": "2021-04-13T11:19:27.862106Z", "title": "its work", "body": "Lorey was here"}, {"date": "2021-04-13T11:19:16.126985Z", "title": "its work", "body": "Lorey was here"}, {"date": "2021-04-13T11:18:59.704072Z", "title": "its work", "body": "Lorey was here"}, {"date": "2021-04-13T11:17:23.714157Z", "title": "its work", "body": "Lorey was here"}, {"date": "2021-04-13T10:51:02.970998Z", "title": "its work", "body": "yep its work"}, {"date": "2021-04-13T10:49:54.203760Z", "title": "its work", "body": "yep its work"}, {"date": "2021-04-13T10:49:22.526488Z", "title": "We notify", "body": "Test message"}, {"date": "2021-04-13T10:48:30.936375Z", "title": "We notify", "body": "Test message"}]}';
      //
      // console.log('re', JSON.parse(re));
      // console.log('user', user.userData.sub);
      //
      // const jsonText = JSON.stringify(data);
      // const hex = await encryptHex(jsonText);
      // console.log('hex', hex);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          checkInternet().then((res) => {
            setConnectionStatus(!res);
          });
          AsyncStorage.removeItem('@reportFilters');
          await MaterialIcons.loadFont();
          await MaterialCommunityIcons.loadFont();

          const factoryData = await AsyncStorage.getItem('factoryID');
          const {factoryId} = JSON.parse(factoryData);

          if (factoryId !== null) {
            setFactoryIds(factoryId);
          } else {
            setFactoryIds(factoriesData);
          }

          await AsyncStorage.getItem('favorites').then((favorite) => {
            let data;
            if (favorite !== null) {
              data = JSON.parse(favorite);
            }
            setFavorites(data);
          });

          await fetchData();
        } catch (error) {
          const {data, status} = error.response;
          crashlytics().log(data.error);
          crashlytics().recordError(data.error);
          if (status === 400) {
            setNodeData([]);
            // Toast.show({
            //   type: 'error',
            //   position: 'top',
            //   text1: data.error,
            //   topOffset: Platform.OS === 'ios' ? 80 : 30,
            //   visibilityTime: 1500,
            // });
            // sleep(500).then(() => {
            //   if (data.error === 'Factory does not exist') {
            //     navigation.navigate('SelectFactoryTab');
            //   }
            // });
          } else {
            console.log('logout message', data.error);
          }
          if (status === 401) {
            await refreshTokens();
          }
        }
      })();

      const refreshID = setInterval(async () => {
        await fetchData();
      }, 1000);

      return () => {
        clearInterval(refreshID);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectionStatus]),
  );

  async function fetchData() {
    await ApiService.getLiveview().then(async ({data}) => {
      const nodes = data?.liveviewInfo;
      setNodeData(nodes);
    });
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
      onPress={() => {
        if (item.lineStatus !== 'notrunning') {
          navigation.navigate('CardDetail', {
            runId: item.runId,
          });
        } else {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Line is not running',
            topOffset: Platform.OS === 'ios' ? 80 : 30,
            visibilityTime: 1500,
          });
        }
      }}
    />
  );

  const handleChecked = async (idx) => {
    let resultData = {};

    await AsyncStorage.getItem('favorites').then((favorite) => {
      if (favorite) {
        resultData = JSON.parse(favorite);
      } else {
        resultData = {};
        _.forEach(organizations, function (organization) {
          _.forEach(organization.factories, function (factory) {
            resultData[factory.id] = [];
          });
        });
      }

      _.forEach(organizations, function (organization) {
        _.forEach(organization.factories, function (factory) {
          if (factoryIds === factory.id) {
            let factoryFavorites = resultData[factory.id];
            if (factoryFavorites.indexOf(idx) === -1) {
              resultData[factory.id].push(idx);
            } else {
              resultData[factory.id] = factoryFavorites.filter(
                (item) => item !== idx,
              );
            }
          }
        });
      });

      AsyncStorage.setItem('favorites', JSON.stringify(resultData));
      setFavorites(resultData);
    });
  };

  if (connectionStatus) {
    return (
      <>
        <HeaderStatus ios={'light'} />
        <SafeAreaView style={styles.container} />
      </>
    );
  }

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        {/*<TouchableOpacity onPress={() => refreshTokens()} style={{marginTop: 20}}>*/}
        {/*  <Text>Click here to update Token </Text>*/}
        {/*</TouchableOpacity>*/}
        <View style={styles.tabContainer}>
          <SegmentedControlTab
            values={['All lines', 'My lines']}
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
              {typeof favorites !== 'undefined' ? (
                !_.isEmpty(favorites[factoryIds]) ? (
                  <ScrollView
                    style={[
                      styles.containerScrollView,
                      {paddingHorizontal: 10},
                    ]}
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
                      {factoryIds &&
                        nodeData.map((item) => {
                          return favorites[factoryIds].indexOf(item.lineId) !==
                            -1
                            ? renderCard({item})
                            : null;
                        })}
                    </View>
                  </ScrollView>
                ) : (
                  <>
                    <IconBox style={{marginTop: 'auto', marginBottom: 15}} />
                    <Text style={styles.subtitle}>
                      You have no lines in your watch list
                    </Text>
                  </>
                )
              ) : (
                <>
                  <IconBox style={{marginTop: 'auto', marginBottom: 15}} />
                  <Text style={styles.subtitle}>
                    You have no lines in your watch list
                  </Text>
                </>
              )}

              <RBSheet
                ref={refRBSheet}
                closeOnDragDown={Platform.OS === 'ios'}
                height={Platform.OS === 'ios' ? 500 : 400}
                closeOnPressMask={true}
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
                  onPress={() => {
                    crashlytics().log('Open edit list - button');
                    refRBSheet.current.close();
                  }}
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
                        <ListItem.Title
                          style={{color: THEME.DARK_COLOR, flex: 1}}>
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
                            checked={
                              typeof favorites !== 'undefined'
                                ? _.isEmpty(favorites[factoryIds])
                                  ? false
                                  : favorites[factoryIds].indexOf(
                                      item.lineId,
                                    ) !== -1
                                : false
                            }
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
    color: 'white',
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
