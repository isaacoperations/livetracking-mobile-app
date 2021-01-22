import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PixelRatio,
} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CommonActions,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {HomeScreen} from '../screens/HomeScreen/HomeScreen';

import {THEME} from '../constants/theme';
import {FONT} from '../constants/fonts';
import IconLive from '../components/IconLive';
import IconReport from '../components/IconReport';
import IconNotification from '../components/IconNotification';
import LogoMini from '../components/LogoMini';
import {AuthContext} from '../context/context';
import {CardDetailScreen} from '../screens/CardDetailsScreen/CardDetailScreen';
import {ReportScreen} from '../screens/ReportScreen/ReportScreen';
import {DownTimeScreen} from '../screens/ReportScreen/DownTimeScreen';
import {CardDetailScreenReport} from '../screens/CardDetailsScreen/CardDetailScreenReport';
import {RunLogScreen} from '../screens/ReportScreen/RunLogScreen';
import {NotificationScreen} from '../screens/NotificationScreen/NotificationScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ReportStack = createStackNavigator();
const NotificationStack = createStackNavigator();

function CustomHeader({title, navigation}) {
  const {logout} = useContext(AuthContext);
  return (
    <View style={styles.image}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => logout()} style={styles.menu}>
          <LogoMini />
        </TouchableOpacity>
      </View>
      <View style={{flex: 3, justifyContent: 'center'}}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={{flex: 1}} />
    </View>
  );
}

function ReportHeader({title, navigation}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <View style={styles.image}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(CommonActions.goBack())}>
          <MaterialIcons
            name="keyboard-arrow-left"
            size={34}
            style={{color: 'white'}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 3, justifyContent: 'center'}}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={{flex: 1}} />
    </View>
  );
}

const HomeStackNavigator = ({route, navigation}) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  console.log('routeName', routeName);
  return (
    <>
      {routeName !== 'CardDetail' ? (
        <CustomHeader
          title={'Test Factory Etobicoke South'}
          navigation={navigation}
        />
      ) : (
        <ReportHeader title={'Run report 2'} navigation={navigation} />
      )}

      <HomeStack.Navigator
        screenOptions={{
          headerShown: false,
          // cardOverlayEnabled: true,
          // ...TransitionPresets.ModalPresentationIOS,
        }}>
        <HomeStack.Screen name="Main" component={HomeScreen} />
        <HomeStack.Screen
          name="CardDetail"
          component={CardDetailScreen}
          options={({route}) => ({
            // cardOverlayEnabled: true,
            // ...TransitionPresets.ModalPresentationIOS,
          })}
        />
      </HomeStack.Navigator>
    </>
  );
};

const ReportStackNavigator = ({route, navigation}) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  const Header = (routes) => {
    if (routes === 'ReportScreen') {
      return (
        <CustomHeader
          title={'Test Factory Etobicoke South'}
          navigation={navigation}
        />
      );
    } else if (routes === 'DownTime') {
      return <ReportHeader title={'Downtime Detail'} navigation={navigation} />;
    } else if (routes === 'RunLog') {
      return (
        <ReportHeader
          title={'Test Factory Etobicoke South'}
          navigation={navigation}
        />
      );
    } else {
      return <ReportHeader title={'Run report'} navigation={navigation} />;
    }
  };
  return (
    <>
      {Header(routeName)}
      <ReportStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <ReportStack.Screen name="ReportScreen" component={ReportScreen} />
        <ReportStack.Screen
          name="CardDetailReport"
          component={CardDetailScreenReport}
          options={
            {
              // cardOverlayEnabled: true,
              // ...TransitionPresets.ModalPresentationIOS,
            }
          }
        />
        <ReportStack.Screen name="DownTime" component={DownTimeScreen} />
        <ReportStack.Screen name="RunLog" component={RunLogScreen} />
      </ReportStack.Navigator>
    </>
  );
};

const NotificationStackNavigator = ({navigation}) => {
  return (
    <>
      <CustomHeader title="Test Factory Etobicoke South" navigation={navigation} />
      <NotificationStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <NotificationStack.Screen
          name="Notification"
          component={NotificationScreen}
        />
      </NotificationStack.Navigator>
    </>
  );
};

function MainTabNavigation() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
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
            tabBarBadge: '',
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default MainTabNavigation;

export const styles = StyleSheet.create({
  headerTitle: {
    textAlign: 'center',
    fontFamily: FONT.SemiBold,
    fontSize: 14,
    color: THEME.WHITE_COLOR,
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
});
