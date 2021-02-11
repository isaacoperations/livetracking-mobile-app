import React, {useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';

export function ReportHeaderFilter({navigation}) {
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.filterContainer}>
          <Button
            buttonStyle={styles.filterButton}
            titleStyle={styles.filterButtonText}
            icon={
              <MaterialIcons
                size={20}
                name={'filter-list'}
                color={THEME.PRIMARY_COLOR_DARK}
              />
            }
            title="2"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('FilterTab')}
          />
          <Button
            buttonStyle={styles.filterButton}
            titleStyle={styles.filterButtonText}
            title="Sep 1, 2020 - Sep 2, 2020"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('FilterTab')}
          />
          <Button
            buttonStyle={styles.filterButton}
            titleStyle={styles.filterButtonText}
            title="Ippolito DXM Node 1"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('FilterTab')}
          />
          <Button
            buttonStyle={styles.filterButton}
            titleStyle={styles.filterButtonText}
            title="Ippolito DXM Node 2"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('FilterTab')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.PRIMARY_COLOR,
    marginBottom: 0,
    height: 60,
    padding: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterButton: {
    borderRadius: 20,
    backgroundColor: THEME.WHITE_COLOR,
    padding: 5,
    paddingRight: 10,
    margin: 5,
    minWidth: 64,
    height: 30,
    alignItems: 'center',
  },
  filterButtonText: {
    color: THEME.PRIMARY_COLOR_DARK,
    marginLeft: 6,
    fontSize: 12,
    fontFamily: FONT.Regular,
  },
});
