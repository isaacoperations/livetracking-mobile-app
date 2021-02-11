import * as React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

function LoadingComponent() {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator color={'black'} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  );
}

export default LoadingComponent;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 8,
  },
  text: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '500',
  },
});
