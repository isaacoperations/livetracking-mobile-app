import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import moment from 'moment';
import crashlytics from '@react-native-firebase/crashlytics';
import {useFocusEffect} from '@react-navigation/native';
import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';
import {useData} from '../../../services/ApiService';

export function ReportHeaderFilter({navigation, filterResult, disabled}) {
  const [lineArray, setLineArray] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const {ApiService} = useData();

  let bool = _.isEmpty(filterResult);
  let countItems;
  let date = moment.utc().format('MMM DD, YYYY');
  let starDate = '';
  let endDate = '';
  let selectDay;
  let filterLine;
  let filterProduct;
  if (!bool) {
    filterLine = _.filter(filterResult.lineDataFull, ['selected', true]);
    filterProduct = _.filter(filterResult.productDataFull, ['selected', true]);
    countItems = _.size(filterLine) + _.size(filterProduct) + 1;
    date = moment.utc(filterResult.date).format('MMM DD, YYYY');
    starDate = moment.utc(filterResult.dateFrom).format('MMM DD, YYYY');
    endDate = moment.utc(filterResult.dateTo).format('MMM DD, YYYY');
    selectDay = filterResult.selectDay;
  }

  async function fetchProductData() {
    try {
      await ApiService.getProducts().then(async ({data}) => {
        const produtSelected = _.map(data, 'id');
        setProductArray(produtSelected);
      });
    } catch (e) {
      crashlytics().log('Filters error - product');
      crashlytics().recordError(e.message);
      setProductArray([]);
    }
  }

  async function fetchLineData() {
    try {
      await ApiService.getLines().then(async ({data}) => {
        const lineSelected = _.map(data, 'id');
        setLineArray(lineSelected);
      });
    } catch (e) {
      crashlytics().log('Filters error - line');
      crashlytics().recordError(e.message);
      setLineArray([]);
    }
  }

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await fetchLineData();
        await fetchProductData();
      })();
      return () => {
        console.log('ReportHeaderFilter logout');
        setLineArray([]);
        setProductArray([]);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

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
                disabledStyle={[
                  styles.filterTransparentButton,
                  styles.disabledStyle,
                ]}
                disabledTitleStyle={styles.disabledTitleStyle}
                buttonStyle={[
                  styles.filterButton,
                  styles.filterTransparentButton,
                ]}
                titleStyle={[styles.filterButtonText, {color: 'white'}]}
                icon={
                  <MaterialIcons
                    size={20}
                    name={'filter-list'}
                    color={disabled ? THEME.DARK_COLOR : THEME.WHITE_COLOR}
                  />
                }
                title="0"
                activeOpacity={0.8}
                onPress={handleResetFilter}
                disabled={disabled}
              />
              <Button
                disabledStyle={[
                  styles.filterTransparentButton,
                  styles.disabledStyle,
                ]}
                disabledTitleStyle={styles.disabledTitleStyle}
                buttonStyle={[
                  styles.filterButton,
                  styles.filterTransparentButton,
                ]}
                titleStyle={[styles.filterButtonText, {color: 'white'}]}
                title={`${moment().format('MMM DD, YYYY')}`}
                activeOpacity={0.8}
                onPress={handleResetFilter}
                disabled={disabled}
              />
              <Button
                disabledStyle={[
                  styles.filterTransparentButton,
                  styles.disabledStyle,
                ]}
                disabledTitleStyle={styles.disabledTitleStyle}
                buttonStyle={[
                  styles.filterButton,
                  styles.filterTransparentButton,
                ]}
                titleStyle={[styles.filterButtonText, {color: 'white'}]}
                title="All lines"
                activeOpacity={0.8}
                onPress={handleResetFilter}
                disabled={disabled}
              />
              <Button
                disabledStyle={[
                  styles.filterTransparentButton,
                  styles.disabledStyle,
                ]}
                disabledTitleStyle={styles.disabledTitleStyle}
                buttonStyle={[
                  styles.filterButton,
                  styles.filterTransparentButton,
                ]}
                titleStyle={[styles.filterButtonText, {color: 'white'}]}
                title="All products"
                activeOpacity={0.8}
                onPress={handleResetFilter}
                disabled={disabled}
              />
            </>
          ) : (
            <>
              <Button
                disabledStyle={[
                  styles.filterTransparentButton,
                  styles.disabledStyle,
                ]}
                disabledTitleStyle={styles.disabledTitleStyle}
                buttonStyle={styles.filterButton}
                titleStyle={styles.filterButtonText}
                icon={
                  <MaterialIcons
                    size={20}
                    name={'filter-list'}
                    color={disabled ? THEME.DARK_COLOR : THEME.PRIMARY_COLOR_DARK}
                  />
                }
                title={`${countItems}`}
                activeOpacity={0.8}
                onPress={handleOpenFilter}
                disabled={disabled}
              />
              {selectDay ? (
                <Button
                  disabledStyle={[
                    styles.filterTransparentButton,
                    styles.disabledStyle,
                  ]}
                  disabledTitleStyle={styles.disabledTitleStyle}
                  buttonStyle={styles.filterButton}
                  titleStyle={styles.filterButtonText}
                  title={date}
                  activeOpacity={0.8}
                  onPress={handleOpenFilter}
                  disabled={disabled}
                />
              ) : (
                <>
                  <Button
                    disabledStyle={[
                      styles.filterTransparentButton,
                      styles.disabledStyle,
                    ]}
                    disabledTitleStyle={styles.disabledTitleStyle}
                    buttonStyle={styles.filterButton}
                    titleStyle={styles.filterButtonText}
                    title={`${starDate} - ${endDate}`}
                    activeOpacity={0.8}
                    onPress={handleOpenFilter}
                    disabled={disabled}
                  />
                </>
              )}
              {_.size(filterLine) === _.size(lineArray) ? (
                <Button
                  disabledStyle={[
                    styles.filterTransparentButton,
                    styles.disabledStyle,
                  ]}
                  disabledTitleStyle={styles.disabledTitleStyle}
                  buttonStyle={styles.filterButton}
                  titleStyle={[styles.filterButtonText]}
                  title="All lines"
                  activeOpacity={0.8}
                  onPress={handleOpenFilter}
                  disabled={disabled}
                />
              ) : _.size(filterLine) > 0 ? (
                filterLine?.map((item) => (
                  <Button
                    disabledStyle={[
                      styles.filterTransparentButton,
                      styles.disabledStyle,
                    ]}
                    disabledTitleStyle={styles.disabledTitleStyle}
                    key={item.id}
                    buttonStyle={styles.filterButton}
                    titleStyle={styles.filterButtonText}
                    title={item.name}
                    activeOpacity={0.8}
                    onPress={handleOpenFilter}
                    disabled={disabled}
                  />
                ))
              ) : null}
              {_.size(filterProduct) === _.size(productArray) ? (
                <Button
                  disabledStyle={[
                    styles.filterTransparentButton,
                    styles.disabledStyle,
                  ]}
                  disabledTitleStyle={styles.disabledTitleStyle}
                  buttonStyle={styles.filterButton}
                  titleStyle={[styles.filterButtonText]}
                  title="All products"
                  activeOpacity={0.8}
                  onPress={handleOpenFilter}
                  disabled={disabled}
                />
              ) : _.size(filterProduct) > 0 ? (
                filterProduct?.map((item) => (
                  <Button
                    disabledStyle={[
                      styles.filterTransparentButton,
                      styles.disabledStyle,
                    ]}
                    disabledTitleStyle={styles.disabledTitleStyle}
                    key={item.id}
                    buttonStyle={styles.filterButton}
                    titleStyle={styles.filterButtonText}
                    title={item.name}
                    activeOpacity={0.8}
                    onPress={handleOpenFilter}
                    disabled={disabled}
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
  filterTransparentButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  disabledStyle: {
    backgroundColor: THEME.WHITE_COLOR,
    opacity: 0.5,
  },
  disabledTitleStyle: {
    color: 'black',
  },
});
