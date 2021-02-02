import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Dimensions,
} from 'react-native';
import {ListItem, CheckBox} from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Clipboard from 'react-native-advanced-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import HeaderStatus from '../../components/HeaderStatus';
import {CardComponent} from '../ReportScreen/components/CardComponent';
import IconBox from '../../components/IconBox';
import {Btn} from '../../components/Button';

import {UserContext, NotificationContext} from '../../context/context';
import {RBSheetHeader} from '../../components/RBSheetHeader';

const cardList = [
  {
    id: 1,
    title: 'Ippolito DXM Node 1',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'success',
    progress: 85,
    isChecked: false,
  },
  {
    id: 2,
    title: 'Ippolito DXM Node 2',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'warning',
    progress: 87,
    isChecked: false,
  },
  {
    id: 3,
    title: 'Ippolito DXM Node 3',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'error',
    progress: 87,
    isChecked: false,
  },
  {
    id: 4,
    title: 'Ippolito DXM Node 4',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'success',
    progress: 87,
    isChecked: false,
  },
  {
    id: 5,
    title: 'Ippolito DXM Node 5',
    description: null,
    status: 'info',
    progress: null,
    isChecked: false,
  },
  {
    id: 6,
    title: 'Ippolito DXM Node 6',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'success',
    progress: 87,
    isChecked: false,
  },
  {
    id: 7,
    title: 'Ippolito DXM Node 7',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'success',
    progress: 87,
    isChecked: false,
  },
  {
    id: 8,
    title: 'Ippolito DXM Node 8',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'warning',
    progress: 87,
    isChecked: false,
  },
  {
    id: 9,
    title: 'Ippolito DXM Node 9',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'success',
    progress: 87,
    isChecked: false,
  },
  {
    id: 10,
    title: 'Ippolito DXM Node 10',
    description: 'Blueberry Muffins w/ whole wheat flour',
    status: 'warning',
    progress: 87,
    isChecked: false,
  },
];

export function HomeScreen({navigation}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [checkData, setCheckData] = useState(cardList);
  const refRBSheet = useRef();
  const numColumns = 2;
  const WIDTH = Dimensions.get('window').width;

  const user = useContext(UserContext);
  const notify = useContext(NotificationContext);

  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
      await MaterialCommunityIcons.loadFont();
    })();
    console.log('home user token', user?.token);
    console.log('home user email', user?.email);
    console.log('home user picture', user?.picture);
    console.log('home notify data', notify);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCard = ({item}) => (
    <CardComponent
      key={item.id}
      id={item.id}
      title={item.title}
      description={item.description}
      status={item.status}
      progress={item.progress}
      onPress={() => navigation.navigate('CardDetail')}
    />
  );

  const handleChecked = (id) => {
    let data = checkData.slice();
    const index = data.findIndex((x) => x.id === id);
    data[index].isChecked = !data[index].isChecked;
    setCheckData(data);
    setIsVisible(false);
  };

  const copyToClipboard = async () => {
    const tokenDevice = await AsyncStorage.getItem('tokenDevice');
    Clipboard.setString(tokenDevice);
  };

  return (
    <>
      <HeaderStatus ios={'light'} />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={copyToClipboard} style={{marginTop: 20}}>
          <Text>Click here to copy to Token Device </Text>
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <SegmentedControlTab
            values={['All lines', 'My line']}
            selectedIndex={selectedIndex}
            onTabPress={(index) => setSelectedIndex(index)}
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
            borderRadius={6}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            activeTabTextStyle={styles.activeTabTextStyle}
          />
        </View>
        {selectedIndex === 0 ? (
          <FlatList
            contentContainerStyle={{
              paddingBottom: 20,
              paddingLeft: 10,
              paddingRight: 10,
            }}
            data={cardList}
            numColumns={numColumns}
            horizontal={false}
            renderItem={renderCard}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <View
            style={[
              styles.container,
              {
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              },
            ]}>
            {isVisible ? (
              <>
                <IconBox style={{marginTop: 'auto', marginBottom: 15}} />
                <Text style={styles.subtitle}>
                  You have no lines in your watch list
                </Text>
              </>
            ) : (
              <>
                <ScrollView
                  style={[
                    styles.containerScrollView,
                    {
                      paddingLeft: 10,
                      paddingRight: 10,
                    },
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      height: '100%',
                      width: '100%',
                    }}>
                    {checkData.map((item, i) => {
                      return item.isChecked ? (
                        <CardComponent
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          status={item.status}
                          progress={item.progress}
                          onPress={() => {
                            navigation.navigate('CardDetail');
                          }}
                        />
                      ) : null;
                    })}
                  </View>
                </ScrollView>
              </>
            )}
            <RBSheet
              ref={refRBSheet}
              closeOnDragDown={false}
              height={Platform.OS === 'ios' ? 500 : 400}
              closeOnPressMask={false}
              customStyles={{
                wrapper: {
                  backgroundColor: 'transparent',
                },
                container: {
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                },
              }}>
              <RBSheetHeader
                onPress={() => refRBSheet.current.close()}
                title={'Edit List'}
                iconName={'close'}
              />
              <ScrollView>
                {checkData.map((item, i) => (
                  <ListItem
                    key={i}
                    containerStyle={{
                      paddingLeft: 30,
                      backgroundColor: 'white',
                    }}
                    activeOpacity={1}
                    onPress={() => handleChecked(item.id)}>
                    <ListItem.Content
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <ListItem.Title style={{color: THEME.DARK_COLOR}}>
                        {item.title}
                      </ListItem.Title>
                      <View>
                        <CheckBox
                          checkedIcon={
                            <MaterialIcons
                              name={'check-circle'}
                              size={24}
                              style={{color: THEME.PRIMARY_COLOR}}
                            />
                          }
                          uncheckedIcon={
                            <MaterialCommunityIcons
                              name={'circle-outline'}
                              size={24}
                              style={{color: THEME.PRIMARY_COLOR}}
                            />
                          }
                          checked={item.isChecked}
                          onPress={() => handleChecked(item.id)}
                        />
                      </View>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </ScrollView>
            </RBSheet>
            <View style={styles.containerBottom}>
              <Btn
                size={THEME.BUTTON_PRIMARY_SMALL}
                fontFamily={FONT.Regular}
                title={'Edit List'}
                icon={false}
                backgroundColor={'transparent'}
                textColorHover={THEME.WHITE_COLOR}
                onPress={() => refRBSheet.current.open()}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E5E5',
    height: '100%',
  },
  containerScrollView: {
    width: '100%',
  },
  text: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    fontFamily: FONT.SemiBold,
  },
  title: {
    fontSize: 22,
    fontFamily: FONT.SemiBold,
    color: THEME.PRIMARY_COLOR_DARK,
    marginBottom: 26,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PEW_COLOR,
    textAlign: 'center',
  },
  tabContainer: {
    padding: 16,
    paddingBottom: 5,
  },
  tabsContainerStyle: {
    height: 42,
    borderRadius: 6,
    padding: 5,
    backgroundColor: THEME.WHITE_COLOR,
  },
  tabStyle: {
    borderColor: THEME.WHITE_COLOR,
    borderRadius: 6,
  },
  tabTextStyle: {
    fontFamily: FONT.Regular,
    color: THEME.CHAR_COLOR,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  activeTabStyle: {
    backgroundColor: THEME.PRIMARY_COLOR_DARK,
    borderRadius: 6,
  },
  activeTabTextStyle: {
    color: '#fff',
  },
  containerBottom: {
    width: '100%',
    padding: 20,
    marginTop: 'auto',
    marginBottom: 0,
  },
});
