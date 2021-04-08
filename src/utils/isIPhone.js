import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
let model = DeviceInfo.getModel();
export const isIPhone = (number1, number2 = 0) => {
  if (Platform.OS === 'android') {
    return number2;
  }
  if (
    model === 'iPhone X' ||
    model === 'iPhone XR' ||
    model === 'iPhone XS' ||
    model === 'iPhone XS Max' ||
    model === 'iPhone 11' ||
    model === 'iPhone 11 Pro' ||
    model === 'iPhone 11 Pro Max' ||
    model === 'iPhone 12 mini' ||
    model === 'iPhone 12' ||
    model === 'iPhone 12 Pro' ||
    model === 'iPhone 12 Pro Max'
  ) {
    return number2;
  } else {
    return number1;
  }
};
