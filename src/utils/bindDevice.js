import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

export const bindDevice = async (ApiService, user_auth0_id) => {
  const tokenFB = await AsyncStorage.getItem('tokenDevice');
  const tokenDeviceAPN = await AsyncStorage.getItem('tokenDeviceAPNs');
  const bindingID = await AsyncStorage.getItem('bindingId');
  if (Platform.OS === 'android' && tokenFB && !bindingID) {
    await ApiService.bindDevice({
      binding_type: 'fcm',
      address: tokenFB,
      user_auth0_id: user_auth0_id,
    })
      .then(async ({data}) => {
        await AsyncStorage.setItem('bindingId', data.bindingId);
      })
      .catch((err) => {
        console.log('[Notification] Bind err: ', err);
      });
  } else if (Platform.OS === 'ios' && tokenDeviceAPN && !bindingID) {
    await ApiService.bindDevice({
      binding_type: 'apn',
      address: tokenDeviceAPN,
      user_auth0_id: user_auth0_id,
    })
      .then(async ({data}) => {
        await AsyncStorage.setItem('bindingId', data.bindingId);
      })
      .catch((err) => {
        console.log('[Notification] Bind err: ', err);
      });
  }
};
