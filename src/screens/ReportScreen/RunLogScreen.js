import React, {useContext, useEffect, useState, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {Divider, SearchBar} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import HeaderStatus from '../../components/HeaderStatus';
import {UserContext} from '../../context/context';
import {ReportHeaderFilter} from '../../components/ReportHeaderFilter';
import {ReportHeaderBack} from '../../components/ReportHeaderBack';

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
  const [nodeData, setNodeData] = useState([]);
  const [sortShownDate, setSortShownDate] = useState(true);
  const [sortShownLine, setSortShownLine] = useState(true);
  const [sortShownSku, setSortShownSku] = useState(true);
  useEffect(() => {
    console.log('home user', user?.token);
    console.log('nodeList', JSON.stringify(nodeList));
    console.log('search result', search);
    setNodeData(nodeList);
    (async () => {
      await MaterialCommunityIcons.loadFont();
      await MaterialIcons.loadFont();
    })();
  }, [search, sortShownLine, nodeData]);

  const updateSearch = (text) => {
    console.log('search text', text);
    setSearch(text);
  };

  const handleSortShowDate = (text) => {
    setSortShownDate(!sortShownDate);
    sortAscDescDate(sortShownDate);
  };
  const handleSortShowLine = (text) => {
    setSortShownLine(!sortShownLine);
    sortAscDescTitle(sortShownLine);
  };
  const handleSortShowSku = (text) => {
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

  //console.log('itemstemsitems', items);

  const sortAscDescDate = (bool) => {
    bool
      ? nodeData.sort(
          (a, b) =>
            moment(a.date).format('YYYYMMDD') >
            moment(b.date).format('YYYYMMDD'),
        )
      : nodeData.sort(
          (a, b) =>
            moment(a.date).format('YYYYMMDD') <
            moment(b.date).format('YYYYMMDD'),
        );
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
              <View style={{flex: 2, paddingLeft: 20}}>
                <Pressable
                  onPress={() => {
                    handleSortShowLine('Line');
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
                        Line
                      </Text>
                      {sortShownLine ? (
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
              <View style={{flex: 2}}>
                <Pressable
                  onPress={() => {
                    handleSortShowSku('sku');
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
                        Sku
                      </Text>
                      {sortShownSku ? (
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
            </View>

            {items?.map((item) => (
              <Fragment key={item.id}>
                <Divider style={styles.divider} />
                <Pressable
                  onPress={() => {
                    navigation.navigate('CardDetailReport');
                  }}>
                  {({pressed}) => (
                    <View style={[styles.block, {backgroundColor: pressed ? THEME.PRIMARY_COLOR_DARK : THEME.WHITE_COLOR}]}>
                      <Text style={[styles.title, {flex: 1, color: pressed ? THEME.WHITE_COLOR : THEME.DARK_COLOR}]}>
                        {moment(item.date)
                          .add(1, 'day')
                          .format('dddd YYYY-MM-DD')}
                      </Text>
                      <Text style={[styles.title, {flex: 2, paddingLeft: 20, color: pressed ? THEME.WHITE_COLOR : THEME.DARK_COLOR}]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.title, {flex: 2, color: pressed ? THEME.WHITE_COLOR : THEME.DARK_COLOR}]}>{item.sku}</Text>
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
    marginTop: Platform.OS === 'ios' ? 30 : 20,
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
