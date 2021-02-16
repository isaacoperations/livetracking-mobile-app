import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {Divider, ButtonGroup} from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

import HeaderStatus from '../../../components/HeaderStatus';
import {ModalHeader} from '../../../components/ModalHeader';
import {Btn} from '../../../components/Button';

export function NotifyScreen({navigation}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledTime, setIsEnabledTime] = useState(true);
  const [isEnabledTimeFrom, setIsEnabledTimeFrom] = useState(false);
  const [isEnabledTimeTo, setIsEnabledTimeTo] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState([]);

  useEffect(() => {
    console.log('selectedIndex', selectedIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  const toggleSwitchTime = () => {
    setIsEnabledTime((previousState) => !previousState);
  };

  const onChangeFrom = (event, selectedDate) => {
    const currentDate = selectedDate || dateFrom;
    setIsEnabledTimeFrom(false);
    setDateFrom(currentDate);
  };

  const onChangeTo = (event, selectedDate) => {
    const currentDate = selectedDate || dateTo;
    setIsEnabledTimeTo(false);
    setDateTo(currentDate);
  };

  function dataWeek() {
    const date = new Date();
    const DAY = 1000 * 60 * 60 * 24;
    console.log('DAY ', DAY);
    let i;
    for (i = 0; i < 7; i++) {
      console.log(date);
      date.setTime(date.getTime() + DAY);
      console.log('setTime', date.setTime(date.getTime() + DAY));
    }
  }

  const days = ['S', 'M', 'T', 'W', 'R', 'F', 'S'];

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={'Notification'}
          onPressClose={() => navigation.goBack()}
          iconTitleClose={'arrow-back-ios'}
          iconShow={false}
          backgroundColor={'#EDF0F3'}
        />
        <ScrollView>
          <View style={[styles.row, {marginTop: 30}]}>
            <Text style={styles.label}>Show In-App Notification</Text>
            <Switch onValueChange={toggleSwitch} value={isEnabled} />
          </View>
          {isEnabled && (
            <Text style={[styles.info, {marginBottom: 60}]}>
              Notify me in-app when my subscribed notifications are triggered.
              To further subscribe or unsubscribe specific notifications, go to
              the desktop web dashboard.
            </Text>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Do Not Disturb</Text>
            <Switch onValueChange={toggleSwitchTime} value={isEnabledTime} />
          </View>
          {isEnabledTime && (
            <>
              <View style={styles.timeBlock}>
                <Text style={styles.labelTime}>Time</Text>
                <View style={{backgroundColor: 'white', marginTop: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsEnabledTimeFrom(!isEnabledTimeFrom);
                      setIsEnabledTimeTo(false);
                    }}
                    activeOpacity={0.8}>
                    <View style={styles.row}>
                      <Text style={styles.label}>From</Text>
                      <Text
                        style={[
                          styles.labelTime,
                          {
                            fontSize: 15,
                            color: isEnabledTimeFrom
                              ? THEME.PRIMARY_COLOR
                              : THEME.PEW_COLOR,
                          },
                        ]}>
                        {moment(dateFrom).format('HH:mm')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Divider style={styles.divider} />
                  {isEnabledTimeFrom && (
                    <RNDateTimePicker
                      locale="es-ES"
                      value={dateFrom}
                      mode={'time'}
                      is24Hour={true}
                      display="spinner"
                      onChange={onChangeFrom}
                      textColor="black"
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      setIsEnabledTimeTo(!isEnabledTimeTo);
                      setIsEnabledTimeFrom(false);
                    }}
                    activeOpacity={0.8}>
                    <View style={styles.row}>
                      <Text style={styles.label}>To</Text>
                      <Text
                        style={[
                          styles.labelTime,
                          {
                            fontSize: 15,
                            color: isEnabledTimeTo
                              ? THEME.PRIMARY_COLOR
                              : THEME.PEW_COLOR,
                          },
                        ]}>
                        {moment(dateTo).format('HH:mm')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Divider style={styles.divider} />
                  {isEnabledTimeTo && (
                    <RNDateTimePicker
                      locale="es-ES"
                      value={dateTo}
                      mode={'time'}
                      is24Hour={true}
                      display="spinner"
                      onChange={onChangeTo}
                      textColor="black"
                    />
                  )}
                </View>
              </View>
              <View style={styles.timeBlock}>
                <Text style={styles.labelTime}>Day</Text>
                <View style={styles.weekRow}>
                  <Text style={styles.dayOn}>On</Text>
                  <Text style={styles.week}>Tue, Wed, Thur, Fri, Weekend</Text>
                </View>
                <View>
                  <ButtonGroup
                    onPress={(prevState) => {
                      setSelectedIndex([...prevState]);
                      dataWeek();
                    }}
                    selectedIndexes={selectedIndex}
                    buttons={days}
                    selectMultiple={true}
                    containerStyle={{height: 48, width: '100%', marginLeft: 0}}
                    selectedButtonStyle={{
                      backgroundColor: THEME.PRIMARY_COLOR,
                    }}
                    innerBorderStyle={{width: 0}}
                    buttonStyle={{
                      backgroundColor: THEME.ASH_2_COLOR,
                    }}
                    textStyle={{
                      color: 'white',
                      fontSize: 15,
                      fontFamily: FONT.Regular,
                    }}
                  />
                </View>
              </View>
            </>
          )}
        </ScrollView>
        <View style={styles.containerBottom}>
          <Btn
            title={'Save'}
            onPress={() => console.log('Save')}
            icon={false}
            navigation={navigation}
            borderColor={THEME.PRIMARY_COLOR}
            backgroundColor={THEME.PRIMARY_COLOR}
            backgroundColorHover={THEME.WHITE_COLOR}
            textColor={THEME.WHITE_COLOR}
            textColorHover={THEME.PRIMARY_COLOR}
            size={THEME.BUTTON_PRIMARY_SMALL}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.GRAY_COLOR,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  label: {
    color: THEME.DARK_COLOR,
    fontFamily: FONT.Regular,
    fontSize: 15,
  },
  labelTime: {
    color: THEME.PEW_COLOR,
    fontFamily: FONT.Regular,
    fontSize: 12,
  },
  info: {
    color: THEME.PEW_COLOR,
    fontFamily: FONT.Regular,
    fontSize: 11,
    paddingHorizontal: 30,
  },
  row: {
    paddingHorizontal: 30,
    backgroundColor: 'white',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  containerBottom: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 'auto',
    marginBottom: 50,
  },
  timeBlock: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  divider: {
    backgroundColor: THEME.GRAY_COLOR,
  },
  dayOn: {
    color: THEME.DARK_COLOR,
    fontSize: 15,
    fontFamily: FONT.Regular,
  },
  week: {
    marginLeft: 22,
    color: THEME.PEW_COLOR,
    fontSize: 15,
    fontFamily: FONT.Regular,
  },
  weekRow: {
    backgroundColor: 'white',
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
});
