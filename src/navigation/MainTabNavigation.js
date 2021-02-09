import React, {useContext, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PixelRatio,
} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {THEME} from '../constants/theme';
import {FONT} from '../constants/fonts';
import {AuthContext, UserContext} from '../context/context';

import IconLive from '../components/IconLive';
import IconReport from '../components/IconReport';
import IconNotification from '../components/IconNotification';
import LogoMini from '../components/LogoMini';
import {HomeScreen} from '../screens/HomeScreen/HomeScreen';
import {CardDetailScreen} from '../screens/CardDetailsScreen/CardDetailScreen';
import {ReportScreen} from '../screens/ReportScreen/ReportScreen';
import {DownTimeScreen} from '../screens/ReportScreen/DownTimeScreen';
import {RunLogScreen} from '../screens/ReportScreen/RunLogScreen';
import {NotificationScreen} from '../screens/NotificationScreen/NotificationScreen';
import {ModalFilterScreen} from '../screens/ReportScreen/screens/ModalFilterScreen';
import {SelectFactoryScreen} from '../screens/SelectFactoryScreen/SelectFactoryScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ReportStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackNavigator = () => {
  const {logout} = useContext(AuthContext);
  const user = useContext(UserContext);
  const {app_metadata} = user;
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <>
      <HomeStack.Navigator screenOptions={screenOptions}>
        <HomeStack.Screen
          name="Main"
          component={HomeScreen}
          options={() => ({
            title: app_metadata?.factories[1].id || 'Test Factory',
            headerLeft: () => (
              <TouchableOpacity onPress={() => logout()} style={styles.menu}>
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
            title: 'Run report',
            headerRight: () => <Text> </Text>,
          })}
        />
      </HomeStack.Navigator>
    </>
  );
};

const ReportStackNavigator = ({navigation, route}) => {
  const {logout} = useContext(AuthContext);
  const user = useContext(UserContext);
  const {app_metadata} = user;
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <>
      <ReportStack.Navigator
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
            title:
              app_metadata?.factories[1].id || 'Test Factory Etobicoke South',
            headerLeft: () => (
              <TouchableOpacity onPress={() => logout()} style={styles.menu}>
                <LogoMini />
              </TouchableOpacity>
            ),
            headerRight: () => <Text> </Text>,
          })}
        />
        <ReportStack.Screen
          name="CardDetailReport"
          component={CardDetailScreen}
          options={() => ({
            title: 'Run report',
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
            title:
              app_metadata?.factories[1].id || 'Test Factory Etobicoke South',
            headerLeft: () => (
              <TouchableOpacity onPress={() => logout()} style={styles.menu}>
                <LogoMini />
              </TouchableOpacity>
            ),
            headerRight: () => <Text> </Text>,
          })}
        />
        <ReportStack.Screen
          name="ModalFilter"
          component={ModalFilterScreen}
          options={() => ({
            title: 'Filters',
            headerRight: () => <Text> </Text>,
            headerShown: false,
            ...TransitionPresets.ModalPresentationIOS,
            cardStyle: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          })}
        />
      </ReportStack.Navigator>
    </>
  );
};

const NotificationStackNavigator = () => {
  const {logout} = useContext(AuthContext);
  const user = useContext(UserContext);
  const {app_metadata} = user;
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <NotificationStack.Navigator screenOptions={screenOptions}>
      <NotificationStack.Screen
        name="Notification"
        component={NotificationScreen}
        options={() => ({
          title:
            app_metadata?.factories[1].id || 'Test Factory Etobicoke South',
          headerLeft: () => (
            <TouchableOpacity onPress={() => logout()} style={styles.menu}>
              <LogoMini />
            </TouchableOpacity>
          ),
          headerRight: () => <Text> </Text>,
        })}
      />
    </NotificationStack.Navigator>
  );
};

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="MenuTab" component={TabNavigator} />
      <Drawer.Screen
        name="SelectFactoryScreen2"
        component={SelectFactoryScreen}
      />
    </Drawer.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarVisible: true,
        tabBarIcon: ({focused}) => {
          let iconName;
          if (route.name === 'Liveview') {
            iconName = (
              <IconLive
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
          }
          return iconName;
        },
      })}
      tabBarOptions={{
        activeTintColor: THEME.PRIMARY_COLOR,
        inactiveTintColor: THEME.PRIMARY_COLOR_HOVER,
        labelStyle: {
          fontFamily: FONT.Medium,
          fontSize: 12,
        },
        tabStyle: {
          paddingTop: 7,
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
        options={{title: 'Report'}}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationStackNavigator}
        options={{
          title: 'Notification',
          tabBarBadgeStyle: styles.tabBarBadgeStyle,
          tabBarBadge: '',
        }}
      />
    </Tab.Navigator>
  );
}

function MainTabNavigation() {
  return <TabNavigator />;
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
