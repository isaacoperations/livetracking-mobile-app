import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useReducer,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import {ListItem, CheckBox} from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Clipboard from 'react-native-advanced-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import {AuthContext, UserContext} from '../../context/context';
import {useData} from '../../services/ApiService';
import reducer, {initialState} from '../../reducer/reducer';

import HeaderStatus from '../../components/HeaderStatus';
import {CardComponent} from '../ReportScreen/components/CardComponent';
import IconBox from '../../components/icons/IconBox';
import {Btn} from '../../components/Button';
import {RBSheetHeader} from '../../components/RBSheetHeader';
import {createAction} from '../../utils/createAction';
import {sleep} from '../../utils/sleep';

export function HomeScreen({navigation}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [nodeData, setNodeData] = useState([]);
  const refRBSheet = useRef();
  const numColumns = 2;
  const WIDTH = Dimensions.get('window').width;

  const [state, dispatch] = useReducer(reducer, initialState);
  const user = useContext(UserContext);
  const {logout} = useContext(AuthContext);
  const {LiveView} = useData();

  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
      await MaterialCommunityIcons.loadFont();
      // await AsyncStorage.removeItem('line');
      console.log('home user data ', user);
    })();

    sleep(100).then(async () => {
      try {
        await AsyncStorage.getItem('line').then((line) => {
          if (line) {
            dispatch(createAction('SET_LINE', JSON.parse(line)));
            setIsVisible(false);
          } else {
            console.log('not found line ', line);
            setIsVisible(true);
          }
        });

        await LiveView.getAllLine().then(async ({data}) => {
          console.log('response data  ', data?.liveviewInfo);
          const nodes = data?.liveviewInfo;
          setNodeData(nodes);
          if (state.line.length > 0) {
            console.log('Ystate line data ', state.line);
          } else {
            console.log('Xstate line not data ', state.line);
            if ((await AsyncStorage.getItem('line')) === null) {
              console.log('Tstate line not data ', state.line);
              dispatch(createAction('SET_LINE', nodes));
              await AsyncStorage.setItem('line', JSON.stringify(nodes));
            }
          }
        });
      } catch (e) {
        console.log('error message', e);
        logout();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('home line data ', state.line);

  const renderCard = ({item}) => (
    <CardComponent
      key={item.lineId}
      id={item.lineId}
      runId={item.runId}
      title={item.lineName}
      description={item.productName}
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
    if (state.line.length > 0) {
      const data = state?.line.map((item) => {
        if (item.lineId === idx) {
          return {
            ...item,
            selected: !item.selected || false,
          };
        }
        return {
          ...item,
          selected: item.selected || false,
        };
      });

      dispatch(createAction('SET_LINE', data));
      await AsyncStorage.setItem('line', JSON.stringify(data));

      const uniqDataBy = _.uniqBy(data, 'selected');
      const some = _.some(uniqDataBy, ['selected', true]);
      if (some) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    } else {
      Alert.alert('Not data');
    }
  };

  const copyToClipboard = async () => {
    const tokenDevice = await AsyncStorage.getItem('tokenDevice');
    Clipboard.setString(tokenDevice);
  };

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={copyToClipboard} style={{marginTop: 20}}>
          <Text>Click here to copy to Token Device </Text>
        </TouchableOpacity>

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
              {isVisible ? (
                <>
                  <IconBox style={{marginTop: 'auto', marginBottom: 15}} />
                  <Text style={styles.subtitle}>
                    You have no lines in your watch list
                  </Text>
                </>
              ) : (
                <>
                  <ScrollView
                    style={[
                      styles.containerScrollView,
                      {paddingHorizontal: 10},
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        height: '100%',
                        width: '100%',
                      }}>
                      {state?.line.map((item, i) => {
                        return item.selected ? renderCard({item}) : null;
                      })}
                    </View>
                  </ScrollView>
                </>
              )}
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
                  {state?.line.map((item) => (
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
                            checked={item.selected || false}
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
