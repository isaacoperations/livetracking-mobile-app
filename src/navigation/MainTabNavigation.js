import React, {
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
  useReducer,
} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PixelRatio,
} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {THEME} from '../constants/theme';
import {FONT} from '../constants/fonts';
import {FactoryContext, UserContext} from '../context/context';

import IconReport from '../components/icons/IconReport';
import IconNotification from '../components/icons/IconNotification';
import LogoMini from '../components/icons/LogoMini';
import {HomeScreen} from '../screens/HomeScreen/HomeScreen';
import {CardDetailScreen} from '../screens/CardDetailsScreen/CardDetailScreen';
import {ReportScreen} from '../screens/ReportScreen/ReportScreen';
import {DownTimeScreen} from '../screens/ReportScreen/DownTimeScreen';
import {RunLogScreen} from '../screens/ReportScreen/RunLogScreen';
import {NotificationScreen} from '../screens/NotificationScreen/NotificationScreen';
import {ModalFilterScreen} from '../screens/ReportScreen/screens/ModalFilterScreen';
import {SelectFactoryScreen} from '../screens/SelectFactoryScreen/SelectFactoryScreen';
import {SettingScreen} from '../screens/SettingScreen/SettingScreen';
import {TroubleShootingScreen} from '../screens/SettingScreen/screens/TroubleshootingScreen';
import {SecurityScreen} from '../screens/SettingScreen/screens/SecurityScreen';
import {NotifyScreen} from '../screens/SettingScreen/screens/NotifyScreen';
import IconLiveview from '../components/icons/IconLiveView';
import {TabBadge} from './components/TabBadge';

import {createAction} from '../utils/createAction';
import reducer, {initialState} from '../reducer/reducer';
import {useInterval} from '../hooks/useInterval';
import {TokenScreen} from '../screens/SettingScreen/screens/TokenScreen';
import {isIPhone} from '../utils/isIPhone';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ReportStack = createStackNavigator();
const SettingStack = createStackNavigator();
const FilterStack = createStackNavigator();
const NotificationStack = createStackNavigator();

const HomeStackNavigator = ({navigation}) => {
  const user = useContext(UserContext);
  const factory = useContext(FactoryContext);
  const [isActive, setIsActive] = useState(factory);
  const {app_metadata} = user;
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
      await AsyncStorage.getItem('factoryID').then((data) => {
        if (data) {
          const {factoryName} = JSON.parse(data);
          setIsActive(factoryName);
        } else {
          setIsActive(factory);
        }
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isFocused]);

  return (
    <>
      <HomeStack.Navigator screenOptions={screenOptions}>
        <HomeStack.Screen
          name="Home"
          component={HomeScreen}
          options={() => ({
            title: isActive || app_metadata?.factories[0]?.name,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('SelectFactoryTab')}
                style={{width: 40}}>
                <LogoMini />
              </TouchableOpacity>
            ),
            headerRight: () => <Text> </Text>,
          })}
        />
        <HomeStack.Screen
          name="CardDetail"
          component={CardDetailScreen}
          options={() => ({
            title: 'Run Report',
            headerRight: () => <Text> </Text>,
          })}
        />
      </HomeStack.Navigator>
    </>
  );
};

const ReportStackNavigator = ({navigation, route}) => {
  const user = useContext(UserContext);
  const factory = useContext(FactoryContext);
  const [isActive, setIsActive] = useState(factory);
  const {app_metadata} = user;
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
      await AsyncStorage.getItem('factoryID').then((data) => {
        if (data) {
          const {factoryName} = JSON.parse(data);
          setIsActive(factoryName);
        } else {
          setIsActive(factory);
        }
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isFocused]);
  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };
  return (
    <>
      <ReportStack.Navigator
        initialRouteName="ReportScreen"
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerLeftContainerStyle: styles.headerLeftContainerStyle,
          headerTitleStyle: styles.headerTitle,
          headerBackTitleStyle: styles.headerBackTitleStyle,
          cardOverlayEnabled: true,
          ...TransitionPresets.DefaultTransition,
          headerBackImage: () => (
            <MaterialIcons
              size={15}
              color={THEME.WHITE_COLOR}
              name={'arrow-back-ios'}
            />
          ),
        }}
        mode="modal">
        <ReportStack.Screen
          name="ReportScreen"
          component={ReportScreen}
          options={() => ({
            title: isActive || app_metadata?.factories[0]?.name,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('SelectFactoryTab')}
                style={{width: 40}}>
                <LogoMini />
              </TouchableOpacity>
            ),
            headerRight: () => <Text> </Text>,
            // animationTypeForReplace: 'pop',
            // transitionSpec: {
            //   open: config,
            //   close: config,
            // },
          })}
          // initialParams={{filterData: undefined}}
        />
        <ReportStack.Screen
          name="CardDetailReport"
          component={CardDetailScreen}
          options={() => ({
            title: 'Run Report',
            headerRight: () => <Text> </Text>,
          })}
        />
        <ReportStack.Screen
          name="DownTime"
          component={DownTimeScreen}
          options={() => ({
            title: 'Downtime Detail',
            headerRight: () => <Text> </Text>,
          })}
        />
        <ReportStack.Screen
          name="RunLog"
          component={RunLogScreen}
          options={() => ({
            title: isActive || app_metadata?.factories[0]?.name,
            headerRight: () => <Text> </Text>,
          })}
        />
      </ReportStack.Navigator>
    </>
  );
};

const NotificationStackNavigator = ({navigation}) => {
  const user = useContext(UserContext);
  const factory = useContext(FactoryContext);
  const [isActive, setIsActive] = useState(factory);
  const {app_metadata} = user;
  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
      await AsyncStorage.getItem('factoryID').then((data) => {
        if (data) {
          const {factoryName} = JSON.parse(data);
          setIsActive(factoryName);
        } else {
          setIsActive(factory);
        }
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isFocused]);
  return (
    <NotificationStack.Navigator screenOptions={screenOptions}>
      <NotificationStack.Screen
        name="Notification"
        component={NotificationScreen}
        options={() => ({
          title: isActive || app_metadata?.factories[0]?.name,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectFactoryTab')}
              style={{width: 40}}>
              <LogoMini />
            </TouchableOpacity>
          ),
          headerRight: () => <Text> </Text>,
        })}
      />
    </NotificationStack.Navigator>
  );
};

function NotificationWithBadge(props) {
  return <TabBadge {...props} />; // badgeCount={3}
}

function TabNavigator() {
  const [{badge}, dispatch] = useReducer(reducer, initialState);
  useInterval(() => {
    (async () => {
      await AsyncStorage.getItem('notifyIcon')
        .then((item) => {
          dispatch(createAction('SET_BADGE', JSON.parse(item)));
        })
        .catch((err) => {
          console.log('err badge', err);
          dispatch(createAction('SET_BADGE', false));
        });
    })();
  }, 2000);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarVisible: true,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Liveview') {
            iconName = (
              <IconLiveview
                color={
                  focused ? THEME.PRIMARY_COLOR : THEME.PRIMARY_COLOR_HOVER
                }
              />
            );
          } else if (route.name === 'Report') {
            iconName = (
              <IconReport
                color={
                  focused ? THEME.PRIMARY_COLOR : THEME.PRIMARY_COLOR_HOVER
                }
              />
            );
          } else if (route.name === 'Notification') {
            iconName = (
              <IconNotification
                color={
                  focused ? THEME.PRIMARY_COLOR : THEME.PRIMARY_COLOR_HOVER
                }
              />
            );
            return (
              <NotificationWithBadge
                name={iconName}
                size={size}
                color={color}
                isShow={badge}
              />
            );
          }
          return iconName;
        },
      })}
      tabBarOptions={{
        activeTintColor: THEME.PRIMARY_COLOR,
        inactiveTintColor: THEME.PRIMARY_COLOR_HOVER,
        keyboardHidesTabBar: true,
        labelStyle: {
          fontFamily: FONT.Medium,
          fontSize: 12,
        },
        tabStyle: {
          paddingTop: 7,
          paddingBottom: isIPhone(10),
        },
      }}>
      <Tab.Screen
        name="Liveview"
        component={HomeStackNavigator}
        options={{
          title: 'Liveview',
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportStackNavigator}
        options={{title: 'Report', unmountOnBlur: true}}
      />
      {/*<Tab.Screen*/}
      {/*  name="Notification"*/}
      {/*  component={NotificationStackNavigator}*/}
      {/*  options={{*/}
      {/*    title: 'Notification',*/}
      {/*  }}*/}
      {/*/>*/}
    </Tab.Navigator>
  );
}

function SettingNavigator() {
  return (
    <SettingStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <SettingStack.Screen
        name="SelectFactory"
        component={SelectFactoryScreen}
      />
      <SettingStack.Screen name="Setting" component={SettingScreen} />
      <SettingStack.Screen
        name="Troubleshooting"
        component={TroubleShootingScreen}
      />
      <SettingStack.Screen name="Security" component={SecurityScreen} />
      <SettingStack.Screen name="NotifySetting" component={NotifyScreen} />
      <SettingStack.Screen name="TokenScreen" component={TokenScreen} />
    </SettingStack.Navigator>
  );
}

function FilterNavigator() {
  return (
    <FilterStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <FilterStack.Screen name="ModalFilter" component={ModalFilterScreen} />
    </FilterStack.Navigator>
  );
}

function RootNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
      mode="modal">
      <RootStack.Screen name="MenuTab" component={TabNavigator} />
      <RootStack.Screen
        name="SelectFactoryTab"
        component={SettingNavigator}
        options={() => ({
          cardStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        })}
      />
      <RootStack.Screen
        name="FilterTab"
        component={FilterNavigator}
        options={() => ({
          cardStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        })}
      />
    </RootStack.Navigator>
  );
}

function MainTabNavigation() {
  return <RootNavigator />;
}

export default MainTabNavigation;

export const styles = StyleSheet.create({
  headerTitle: {
    textAlign: 'center',
    fontFamily: FONT.SemiBold,
    fontSize: 14,
    color: THEME.WHITE_COLOR,
  },
  headerStyle: {
    backgroundColor: THEME.PRIMARY_COLOR,
    shadowColor: THEME.TRANSPARENT_COLOR,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    shadowOpacity: 0,
  },
  headerLeftContainerStyle: {
    paddingLeft: 20,
  },
  headerBackTitleStyle: {
    color: THEME.PRIMARY_COLOR,
  },
  tabNavigator: {
    paddingTop: 10,
  },
  image: {
    width: '100%',
    height: Platform.OS === 'ios' ? 88 : 50,
    paddingTop: Platform.OS === 'ios' ? 30 : 0,
    flexDirection: 'row',
    backgroundColor: THEME.PRIMARY_COLOR,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  tabBarBadgeStyle: {
    backgroundColor: 'red',
    top: Platform.OS === 'ios' ? 3 : 0,
    left: 2,
    borderWidth: 1,
    borderColor: 'red',
    maxWidth: 7,
    height: 10,
    borderRadius: 10 / PixelRatio.get(0),
  },
});

export const screenOptions = {
  headerStyle: styles.headerStyle,
  headerLeftContainerStyle: styles.headerLeftContainerStyle,
  headerTitleStyle: styles.headerTitle,
  headerBackTitleStyle: styles.headerBackTitleStyle,
  headerBackImage: () => (
    <MaterialIcons
      size={15}
      color={THEME.WHITE_COLOR}
      name={'arrow-back-ios'}
    />
  ),
};
