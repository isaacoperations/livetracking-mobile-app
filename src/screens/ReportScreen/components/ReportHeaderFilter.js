import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import moment from 'moment';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';

export function ReportHeaderFilter({navigation, filterResult}) {
  const bool = _.isEmpty(filterResult);
  let countItems;
  let date = '';
  let starDate = '';
  let endDate = '';
  if (!bool) {
    countItems =
      filterResult.lineDataFull.length +
      filterResult.productDataFull.length +
      2;
    date = moment(filterResult.date).format('MMM DD, YYYY');
    starDate = moment(filterResult.dateFrom).format('MMM DD, YYYY');
    endDate = moment(filterResult.dateTo).format('MMM DD, YYYY');
  }
  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
    })();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.filterContainer}>
          {bool ? (
            <>
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
                title=""
                activeOpacity={0.8}
                onPress={() => navigation.navigate('FilterTab')}
              />
              <Button
                buttonStyle={styles.filterButton}
                titleStyle={styles.filterButtonText}
                title="No filters"
                activeOpacity={0.8}
                onPress={() => navigation.navigate('FilterTab')}
              />
            </>
          ) : (
            <>
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
                title={`${countItems}`}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('FilterTab')}
              />
              {date && (
                <Button
                  buttonStyle={styles.filterButton}
                  titleStyle={styles.filterButtonText}
                  title={date}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('FilterTab')}
                />
              )}
              {starDate && (
                <Button
                  buttonStyle={styles.filterButton}
                  titleStyle={styles.filterButtonText}
                  title={`${starDate} - ${endDate}`}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('FilterTab')}
                />
              )}
              {filterResult.lineDataFull.length > 0
                ? filterResult.lineDataFull.map((item) => (
                    <Button
                      key={item.id}
                      buttonStyle={styles.filterButton}
                      titleStyle={styles.filterButtonText}
                      title={item.name}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('FilterTab')}
                    />
                  ))
                : null}
              {filterResult.productDataFull.length > 0
                ? filterResult.productDataFull.map((item) => (
                    <Button
                      key={item.id}
                      buttonStyle={styles.filterButton}
                      titleStyle={styles.filterButtonText}
                      title={item.name}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('FilterTab')}
                    />
                  ))
                : null}
            </>
          )}
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
