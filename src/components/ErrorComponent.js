import * as React from 'react';
import {View, Text} from 'react-native';
import {THEME} from '../constants/theme';

function ErrorComponent({text}) {
  return (
    <View>
      <Text style={[THEME.TEXT, {textAlign: 'center', color: 'red'}]}>
        {text}
      </Text>
    </View>
  );
}

export default ErrorComponent;
