import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {OnboardingScreen} from '../screens/OnboardingScreen/OnboardingScreen';
import {EnableNotificationScreen} from '../screens/NotificationScreen/EnableNotificationScreen';

const OnboardingStack = createStackNavigator();

const OnboardingStackNavigator = () => {
  return (
    <OnboardingStack.Navigator initialRouteName="Onboarding">
      <OnboardingStack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          headerShown: false,
        }}
      />
      <OnboardingStack.Screen
        name="Notification"
        component={EnableNotificationScreen}
        options={{
          headerShown: false,
        }}
      />
    </OnboardingStack.Navigator>
  );
};

export default OnboardingStackNavigator;
