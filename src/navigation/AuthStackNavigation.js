import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {HomeScreen} from '../screens/HomeScreen/HomeScreen';
import {AuthenticationScreen} from '../screens/AuthenticationScreen/AuthenticationScreen';
import {LoginScreen} from '../screens/AuthenticationScreen/LoginScreen';
import {ForgotPasswordScreen} from '../screens/AuthenticationScreen/ForgotPasswordScreen';
import {AuthInfoScreen} from '../screens/AuthenticationScreen/AuthInfoScreen';
import {OnboardingScreen} from '../screens/OnboardingScreen/OnboardingScreen';
import {EnableNotificationScreen} from '../screens/NotificationScreen/EnableNotificationScreen';

import {THEME} from '../constants/theme';
import {FONT} from '../constants/fonts';

const AuthStack = createStackNavigator();

const AuthStackNavigator = () => {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  const options = (title) => ({
    headerTitle: title,
    headerTitleAlign: 'center',
    headerTitleStyle: {
      color: THEME.DARK_COLOR,
      fontSize: 17,
      fontFamily: FONT.SemiBold,
    },
    headerStyle: {
      shadowColor: THEME.TRANSPARENT_COLOR,
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
    },
    headerBackTitle: ' ',
    headerBackImage: () => (
      <MaterialIcons
        style={{color: THEME.DARK_COLOR}}
        name="keyboard-arrow-left"
        size={34}
      />
    ),
  });
  return (
    <AuthStack.Navigator initialRouteName="Authentication">
      <AuthStack.Screen
        name="Home"
        component={HomeScreen}
        options={options('Home')}
      />
      <AuthStack.Screen
        name="Authentication"
        component={AuthenticationScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={options('Login')}
      />
      <AuthStack.Screen
        name="Register"
        component={LoginScreen}
        options={options('Sign up')}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={options('Forgot Password')}
      />
      <AuthStack.Screen
        name="AuthInfo"
        component={AuthInfoScreen}
        options={options('Don’t have an account?')}
      />
      <AuthStack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="Notification"
        component={EnableNotificationScreen}
        options={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
