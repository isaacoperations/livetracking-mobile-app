import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import moment from 'moment';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';

export function ReportHeaderFilter({
  navigation,
  filterResult,
  allProducts,
  allLines,
}) {
  let bool = _.isEmpty(filterResult);
  let countItems;
  let date = '';
  let starDate = '';
  let endDate = '';
  let selectDay;
  let filterLine;
  let filterProduct;
  if (!bool) {
    filterLine = _.filter(filterResult.lineDataFull, ['selected', true]);
    filterProduct = _.filter(filterResult.productDataFull, ['selected', true]);
    countItems = _.size(filterLine) + _.size(filterProduct) + 1;
    date = moment(filterResult.date).format('MMM DD, YYYY');
    starDate = moment(filterResult.dateFrom).format('MMM DD, YYYY');
    endDate = moment(filterResult.dateTo).format('MMM DD, YYYY');
    selectDay = filterResult.selectDay;
  }

  const handleResetFilter = () => {
    return navigation.navigate('FilterTab', {
      screen: 'ModalFilter',
      params: {filterDataTab: undefined},
    });
  };

  const handleOpenFilter = () => {
    return navigation.navigate('FilterTab', {
      screen: 'ModalFilter',
      params: {filterDataTab: filterResult},
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.filterContainer}>
          {bool ? (
            <>
              <Button
                buttonStyle={[
                  styles.filterButton,
                  {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: 'white',
                  },
                ]}
                titleStyle={[styles.filterButtonText, {color: 'white'}]}
                icon={
                  <MaterialIcons
                    size={20}
                    name={'filter-list'}
                    color={THEME.WHITE_COLOR}
                  />
                }
                title="0"
                activeOpacity={0.8}
                onPress={handleResetFilter}
              />
              <Button
                buttonStyle={[
                  styles.filterButton,
                  {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: 'white',
                  },
                ]}
                titleStyle={[styles.filterButtonText, {color: 'white'}]}
                title={`${moment().format('MMM DD, YYYY')}`}
                activeOpacity={0.8}
                onPress={handleResetFilter}
              />
              <Button
                buttonStyle={[
                  styles.filterButton,
                  {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: 'white',
                  },
                ]}
                titleStyle={[styles.filterButtonText, {color: 'white'}]}
                title="All lines"
                activeOpacity={0.8}
                onPress={handleResetFilter}
              />
              <Button
                buttonStyle={[
                  styles.filterButton,
                  {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: 'white',
                  },
                ]}
                titleStyle={[styles.filterButtonText, {color: 'white'}]}
                title="All products"
                activeOpacity={0.8}
                onPress={handleResetFilter}
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
                onPress={handleOpenFilter}
              />
              {selectDay ? (
                <Button
                  buttonStyle={styles.filterButton}
                  titleStyle={styles.filterButtonText}
                  title={date}
                  activeOpacity={0.8}
                  onPress={handleOpenFilter}
                />
              ) : (
                <>
                  <Button
                    buttonStyle={styles.filterButton}
                    titleStyle={styles.filterButtonText}
                    title={`${starDate} - ${endDate}`}
                    activeOpacity={0.8}
                    onPress={handleOpenFilter}
                  />
                </>
              )}
              {filterLine.length === allLines.length ? (
                <Button
                  buttonStyle={styles.filterButton}
                  titleStyle={[styles.filterButtonText]}
                  title="All lines"
                  activeOpacity={0.8}
                  onPress={handleResetFilter}
                />
              ) : filterLine.length > 0 ? (
                filterLine?.map((item) => (
                  <Button
                    key={item.id}
                    buttonStyle={styles.filterButton}
                    titleStyle={styles.filterButtonText}
                    title={item.name}
                    activeOpacity={0.8}
                    onPress={handleOpenFilter}
                  />
                ))
              ) : null}
              {filterProduct.length === allProducts.length ? (
                <Button
                  buttonStyle={styles.filterButton}
                  titleStyle={[styles.filterButtonText]}
                  title="All products"
                  activeOpacity={0.8}
                  onPress={handleResetFilter}
                />
              ) : filterProduct.length > 0 ? (
                filterProduct?.map((item) => (
                  <Button
                    key={item.id}
                    buttonStyle={styles.filterButton}
                    titleStyle={styles.filterButtonText}
                    title={item.name}
                    activeOpacity={0.8}
                    onPress={handleOpenFilter}
                  />
                ))
              ) : null}
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
