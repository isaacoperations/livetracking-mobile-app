import * as React from 'react';
import {Text} from 'react-native';
import {THEME} from '../constants/theme';

function ErrorComponent({text = ''}) {
  return (
    <Text style={[THEME.TEXT, {textAlign: 'center', color: 'red'}]}>
      {text}
    </Text>
  );
}

export default ErrorComponent;
