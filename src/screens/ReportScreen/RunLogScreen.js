import React, {useContext, useEffect, useState, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import {Divider, SearchBar} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import _ from 'lodash';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import HeaderStatus from '../../components/HeaderStatus';
import {UserContext} from '../../context/context';
import {ReportHeaderFilter} from './components/ReportHeaderFilter';
import {ReportHeaderBack} from './components/ReportHeaderBack';

const nodeList = [
  {
    id: 1,
    title: 'Ippolito DXM Node 1',
    sku: 'ABlueberry Muffins w/ whole wheat flour and other long name',
    date: 'Sun Jan 16 2021 22:33:48 GMT+0600',
  },
  {
    id: 2,
    title: 'Ippolito DXM Line 2',
    sku: 'BBlueberry Muffins w/ whole wheat flour and other long name 2',
    date: 'Mon Jan 15 2021 22:33:48 GMT+0600',
  },
  {
    id: 3,
    title: 'Ippolito DXM Node 3',
    sku: 'CBlueberry Muffins w/ whole wheat flour and other long name 3',
    date: 'Fri Jan 17 2021 22:33:48 GMT+0600',
  },
];

export function RunLogScreen({navigation}) {
  const user = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [nodeData, setNodeData] = useState(nodeList || []);
  const [sortShownDate, setSortShownDate] = useState(true);
  const [sortShownLine, setSortShownLine] = useState(true);
  const [sortShownSku, setSortShownSku] = useState(true);
  useEffect(() => {
    console.log('home user', user?.token);
    console.log('search result', search);
    (async () => {
      await MaterialCommunityIcons.loadFont();
      await MaterialIcons.loadFont();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortShownLine, nodeData]);

  const updateSearch = (text) => {
    setSearch(text);
  };

  const handleSortShowDate = () => {
    setSortShownDate(!sortShownDate);
    sortAscDescDate(sortShownDate);
  };
  const handleSortShowLine = () => {
    setSortShownLine(!sortShownLine);
    sortAscDescTitle(sortShownLine);
  };
  const handleSortShowSku = () => {
    setSortShownSku(!sortShownSku);
    sortAscDesSKU(sortShownSku);
  };

  const items = nodeData.filter((data) => {
    if (search === null) {
      return data;
    } else if (data.title.toLowerCase().includes(search.toLowerCase())) {
      return data;
    }
  });

  const sortAscDescDate = (bool) => {
    let data;
    if (bool) {
      data = _.orderBy(
        nodeData,
        function (dateObj) {
          return new Date(dateObj.date);
        },
        ['asc'],
      );
    } else {
      data = _.orderBy(
        nodeData,
        function (dateObj) {
          return new Date(dateObj.date);
        },
        ['desc'],
      );
    }
    setNodeData(data);
  };

  const sortAscDescTitle = (bool) => {
    bool
      ? nodeData.sort((a, b) => a.title > b.title)
      : nodeData.sort((a, b) => a.title < b.title);
  };

  const sortAscDesSKU = (bool) => {
    bool
      ? nodeData.sort((a, b) => a.sku > b.sku)
      : nodeData.sort((a, b) => a.sku < b.sku);
  };

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        <ReportHeaderFilter navigation={navigation} />
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
        <ScrollView style={styles.container}>
          <View>
            <View style={styles.block}>
              <View style={{flex: 1}}>
                <Pressable
                  onPress={() => {
                    handleSortShowDate('Date');
                  }}>
                  {({pressed}) => (
                    <View style={{flexDirection: 'row'}}>
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
                      {sortShownDate ? (
                        <MaterialCommunityIcons
                          size={15}
                          color={
                            pressed ? THEME.PRIMARY_COLOR : THEME.DARK_COLOR
                          }
                          name={'sort-ascending'}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          size={15}
                          color={
                            pressed ? THEME.PRIMARY_COLOR : THEME.DARK_COLOR
                          }
                          name={'sort-descending'}
                        />
                      )}
                    </View>
                  )}
                </Pressable>
              </View>
              <View style={{flex: 2, paddingLeft: 20}} />
              <View style={{flex: 2}} />
            </View>

            {items?.map((item) => (
              <Fragment key={item.id}>
                <Divider style={styles.divider} />
                <Pressable
                  onPress={() =>
                    navigation.navigate('CardDetailReport', {
                      id: item.lineId || 1,
                      title: item.lineName || 1,
                      description: item.productName || 1,
                      status: item.lineStatus || 1,
                      progressLine: item.lineTargetEfficiency || 1,
                      progressRun: item.runEfficiency || 1,
                      currentDowntimeDurationSeconds:
                        item.currentDowntimeDurationSeconds || 1,
                      currentDowntimeStartTime:
                        item.currentDowntimeStartTime || 1,
                      currentDowntimeStatus: item.currentDowntimeStatus || 1,
                      runDurationSeconds: item.runDurationSeconds || 1,
                      runStartTime: item.runStartTime || 1,
                      targetSpeed: item.targetSpeed || 1,
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
                            flex: 1,
                            color: pressed
                              ? THEME.WHITE_COLOR
                              : THEME.DARK_COLOR,
                          },
                        ]}>
                        {moment(item.date)
                          .add(1, 'day')
                          .format('dddd YYYY-MM-DD')}
                      </Text>
                      <Text
                        style={[
                          styles.title,
                          {
                            flex: 2,
                            paddingLeft: 20,
                            color: pressed
                              ? THEME.WHITE_COLOR
                              : THEME.DARK_COLOR,
                          },
                        ]}>
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.title,
                          {
                            flex: 2,
                            color: pressed
                              ? THEME.WHITE_COLOR
                              : THEME.DARK_COLOR,
                          },
                        ]}>
                        {item.sku}
                      </Text>
                    </View>
                  )}
                </Pressable>
                <Divider style={styles.divider} />
              </Fragment>
            ))}
          </View>
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
  block: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
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
});
