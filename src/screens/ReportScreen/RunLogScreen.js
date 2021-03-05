import React, {useState, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import {Divider, SearchBar} from 'react-native-elements';
import moment from 'moment';
import _ from 'lodash';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import HeaderStatus from '../../components/HeaderStatus';
import {ReportHeaderFilter} from './components/ReportHeaderFilter';
import {ReportHeaderBack} from './components/ReportHeaderBack';
import IconAscDesc from '../../components/icons/IconAscDesc';
import {EmptyComponent} from './components/EmptyComponent';

export function RunLogScreen({navigation, route}) {
  const {logData} = route.params;
  const [search, setSearch] = useState('');
  const [nodeData, setNodeData] = useState(logData || []);
  const [sortShownDate, setSortShownDate] = useState(true);
  const [sortShownProduct, setSortShownProduct] = useState(true);
  const WIDTH = Dimensions.get('window').width;

  console.log('logData --------', logData);

  const updateSearch = (text) => {
    setSearch(text);
  };

  const handleSortShowDate = () => {
    setSortShownDate(!sortShownDate);
    let data;
    if (sortShownDate) {
      data = _.orderBy(
        nodeData,
        function (dateObj) {
          return new Date(dateObj.runStartTime);
        },
        ['asc'],
      );
    } else {
      data = _.orderBy(
        nodeData,
        function (dateObj) {
          return new Date(dateObj.runStartTime);
        },
        ['desc'],
      );
    }
    setNodeData(data);
  };
  const handleSortShowProduct = () => {
    setSortShownProduct(!sortShownProduct);
    let data;
    if (sortShownProduct) {
      data = _.orderBy(nodeData, ['productName'], ['asc']);
    } else {
      data = _.orderBy(nodeData, ['productName'], ['desc']);
    }
    setNodeData(data);
  };

  const items = nodeData.filter((data) => {
    if (search === null) {
      return data;
    } else if (data.lineName.toLowerCase().includes(search.toLowerCase())) {
      return data;
    }
  });

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        <ReportHeaderFilter navigation={navigation} filterResult={typeof route.params !== 'undefined' ? route.params?.filterData : {}} />
        <ReportHeaderBack navigation={navigation} />
        <SearchBar
          onChangeText={updateSearch}
          value={search}
          lightTheme={true}
          showLoading={false}
          containerStyle={styles.searchContainerStyle}
          inputContainerStyle={styles.searchInputContainerStyle}
          searchIcon={{
            size: 20,
          }}
          inputStyle={styles.searchInputStyle}
        />
        <ScrollView nestedScrollEnabled={true}>
          <ScrollView nestedScrollEnabled={true} horizontal={true}>
            <View>
              {_.isEmpty(items) ? (
                <View style={{marginTop: 100, width: Math.round(WIDTH)}}>
                  <EmptyComponent />
                </View>
              ) : (
                <>
                  <View style={styles.headerBlock}>
                    <View style={{width: 70}}>
                      <Pressable onPress={handleSortShowDate}>
                        {({pressed}) => (
                          <View style={styles.flexCenter}>
                            <Text
                              style={[
                                styles.title,
                                styles.uppercase,
                                {
                                  color: pressed
                                    ? THEME.PRIMARY_COLOR
                                    : THEME.DARK_COLOR,
                                  marginRight: 5,
                                },
                              ]}>
                              Date
                            </Text>
                            {!sortShownDate ? (
                              <IconAscDesc
                                color={
                                  pressed
                                    ? THEME.PRIMARY_COLOR
                                    : THEME.DARK_COLOR
                                }
                              />
                            ) : (
                              <IconAscDesc
                                color={
                                  pressed
                                    ? THEME.PRIMARY_COLOR
                                    : THEME.DARK_COLOR
                                }
                                style={{transform: [{rotateX: '180deg'}]}}
                              />
                            )}
                          </View>
                        )}
                      </Pressable>
                    </View>
                    <Text
                      style={[
                        styles.uppercase,
                        styles.title,
                        {width: 130, paddingLeft: 10},
                      ]}>
                      Line
                    </Text>
                    <View style={{width: 100}}>
                      <Pressable onPress={handleSortShowProduct}>
                        {({pressed}) => (
                          <View style={styles.flexCenter}>
                            <Text
                              style={[
                                styles.title,
                                styles.uppercase,
                                {
                                  color: pressed
                                    ? THEME.PRIMARY_COLOR
                                    : THEME.DARK_COLOR,
                                  marginRight: 5,
                                },
                              ]}>
                              Product
                            </Text>
                            {!sortShownProduct ? (
                              <IconAscDesc
                                color={
                                  pressed
                                    ? THEME.PRIMARY_COLOR
                                    : THEME.DARK_COLOR
                                }
                              />
                            ) : (
                              <IconAscDesc
                                color={
                                  pressed
                                    ? THEME.PRIMARY_COLOR
                                    : THEME.DARK_COLOR
                                }
                                style={{transform: [{rotateX: '180deg'}]}}
                              />
                            )}
                          </View>
                        )}
                      </Pressable>
                    </View>
                    <Text
                      style={[styles.uppercase, styles.title, {width: 130}]}>
                      Description
                    </Text>
                    {/*<Text style={[styles.uppercase, styles.title, {width: 130}]}>SKU</Text>*/}
                  </View>
                  <Divider style={styles.divider} />
                  {items?.map((item) => (
                    <Fragment key={item.runId}>
                      <Divider style={styles.divider} />
                      <Pressable
                        onPress={() =>
                          navigation.navigate('CardDetailReport', {
                            runId: item.runId,
                          })
                        }>
                        {({pressed}) => (
                          <View
                            style={[
                              styles.block,
                              {
                                backgroundColor: pressed
                                  ? THEME.PRIMARY_COLOR_DARK
                                  : THEME.WHITE_COLOR,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.title,
                                {
                                  width: 70,
                                  color: pressed
                                    ? THEME.WHITE_COLOR
                                    : THEME.DARK_COLOR,
                                },
                              ]}>
                              {moment(item.runStartTime).format(
                                'dddd YYYY-MM-DD',
                              )}
                            </Text>
                            <Text
                              style={[
                                styles.title,
                                {
                                  width: 130,
                                  paddingLeft: 10,
                                  color: pressed
                                    ? THEME.WHITE_COLOR
                                    : THEME.DARK_COLOR,
                                },
                              ]}>
                              {item.lineName}
                            </Text>
                            <Text
                              style={[
                                styles.title,
                                {
                                  width: 100,
                                  color: pressed
                                    ? THEME.WHITE_COLOR
                                    : THEME.DARK_COLOR,
                                },
                              ]}>
                              {item.productName}
                            </Text>
                            <Text
                              style={[
                                styles.title,
                                {
                                  width: 130,
                                  color: pressed
                                    ? THEME.WHITE_COLOR
                                    : THEME.DARK_COLOR,
                                },
                              ]}>
                              {item.productDescription}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                      <Divider style={styles.divider} />
                    </Fragment>
                  ))}
                </>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  headerBlock: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  block: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  flexCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    flexShrink: 1,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  searchContainerStyle: {
    backgroundColor: THEME.GRAY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchInputContainerStyle: {
    backgroundColor: THEME.WHITE_COLOR,
    borderRadius: 20,
    height: 36,
  },
  searchInputStyle: {
    backgroundColor: THEME.WHITE_COLOR,
    fontSize: 14,
    fontFamily: FONT.Regular,
  },
  divider: {
    backgroundColor: THEME.GRAY_COLOR,
    marginLeft: -30,
    marginRight: -30,
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
});
