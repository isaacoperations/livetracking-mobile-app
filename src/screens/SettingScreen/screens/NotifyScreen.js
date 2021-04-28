import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {Divider, ButtonGroup} from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';

import HeaderStatus from '../../../components/HeaderStatus';
import {ModalHeader} from '../../../components/ModalHeader';
import {Btn} from '../../../components/Button';
import crashlytics from '@react-native-firebase/crashlytics';
import {encryptHex} from '../../../utils/encrypt';
import {getDataNotify} from '../../../services/NotifyService';

export function NotifyScreen({navigation}) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isEnabledTime, setIsEnabledTime] = useState(false);
  const [isEnabledTimeFrom, setIsEnabledTimeFrom] = useState(true);
  const [isEnabledTimeTo, setIsEnabledTimeTo] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [dateMin, setDateMin] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    (async () => {
      crashlytics().log('Notify setting - screen');
      await AsyncStorage.getItem('formNotify')
        .then((data) => {
          if (data) {
            const formData = JSON.parse(data);
            const setTimeFrom = moment(formData?.timeFrom, 'HH:mm');
            const setTimeTo = moment(formData?.timeTo, 'HH:mm');
            setIsEnabled(formData.showInNotify);
            setIsEnabledTime(formData.showInDisturb);
            setSelectedDays(formData.daysText);
            setSelectedIndex(formData.daysIndex);
            setDateFrom(setTimeFrom._d);
            setDateTo(setTimeTo._d);
          }
        })
        .catch((error) => {
          crashlytics().recordError(error);
          setIsEnabled(false);
          setIsEnabledTime(false);
          setSelectedDays([]);
          setSelectedIndex([]);
          setDateFrom(new Date());
          setDateTo(new Date());
        });
    })();
  }, []);

  const toggleSwitch = () => {
    crashlytics().log('Notify setting - toggleSwitch');
    setIsEnabled((previousState) => !previousState);
  };
  const toggleSwitchTime = () => {
    crashlytics().log('Notify setting - toggleSwitchTime');
    setIsEnabledTime((previousState) => !previousState);
  };

  let onChangeFrom;

  if (Platform.OS === 'ios') {
    onChangeFrom = (event, selectedDate) => {
      const currentDate = selectedDate || dateFrom;
      setIsEnabledTimeFrom(true);
      setDateFrom(currentDate);
      setDateMin(currentDate);
    };
  } else {
    onChangeFrom = (selectedDate) => {
      const currentDate = selectedDate || dateFrom;
      setIsEnabledTimeFrom(true);
      setDateFrom(currentDate);
      setDateMin(currentDate);
    };
  }

  let onChangeTo;
  if (Platform.OS === 'ios') {
    onChangeTo = (event, selectedDate) => {
      const currentDate = selectedDate || dateTo;
      setIsEnabledTimeTo(true);
      setDateTo(currentDate);
    };
  } else {
    onChangeTo = (selectedDate) => {
      const currentDate = selectedDate || dateTo;
      setIsEnabledTimeTo(true);
      setDateTo(currentDate);
    };
  }

  const week = moment.weekdaysShort();
  const weekMini = week.map((s) => {
    return s.charAt(0);
  });

  const showDays = (data) => {
    let tempArray = [];
    data.map((item) => {
      week.map((day, index) => {
        if (item === index) {
          return tempArray.push(day);
        }
      });
    });
    setSelectedDays(tempArray);
  };

  const handleSave = async () => {
    console.log('dateFrom', dateFrom);
    console.log('dateTo', dateTo);
    crashlytics().log('Notify setting - save button');
    const tokenFB = await AsyncStorage.getItem('tokenDevice');
    const formLocale = {
      daysText: selectedDays,
      daysIndex: selectedIndex,
      showInNotify: isEnabled,
      showInDisturb: isEnabledTime,
      timeFrom: moment(dateFrom).format('HH:mm'),
      timeTo: moment(dateTo).format('HH:mm'),
    };
    const formApi = {
      daysText: selectedDays,
      daysIndex: selectedIndex,
      dnd: isEnabledTime ? 1 : 0,
      startTime: moment.utc(dateFrom).format('HH:mm'),
      endTime: moment.utc(dateTo).format('HH:mm'),
      firebase_token: tokenFB,
      device: Platform.OS === 'ios' ? 'IOS' : 'Android',
    };
    const jsonText = JSON.stringify(formApi);
    const hex = await encryptHex(jsonText);
    await getDataNotify(`/api/dnd?data=${hex}`).catch((error) => {
      console.log('error 2', error);
    });
    await AsyncStorage.setItem('formNotify', JSON.stringify(formLocale));
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Save',
      topOffset: Platform.OS === 'ios' ? 80 : 30,
      visibilityTime: 300,
    });
  };

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
                        {moment(dateFrom).format('LT')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Divider style={styles.divider} />
                  {isEnabledTimeFrom ? (
                    Platform.OS === 'ios' ? (
                      <RNDateTimePicker
                        locale="us-US"
                        // timeZoneOffsetInMinutes={0}
                        // timeZoneOffsetInSeconds={0}
                        value={dateFrom}
                        mode={'time'}
                        is24Hour={false}
                        display="spinner"
                        onChange={onChangeFrom}
                        textColor="black"
                      />
                    ) : (
                      <View style={{alignItems: 'center'}}>
                        <DatePicker
                          locale="us-US"
                          // timeZoneOffsetInMinutes={0}
                          // timeZoneOffsetInSeconds={0}
                          date={dateFrom}
                          androidVariant={'nativeAndroid'}
                          // is24hourSource="locale"
                          mode={'time'}
                          textColor="black"
                          onDateChange={onChangeFrom}
                        />
                      </View>
                    )
                  ) : null}
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
                        {moment(dateTo).format('LT')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Divider style={styles.divider} />
                  {isEnabledTimeTo ? (
                    Platform.OS === 'ios' ? (
                      <RNDateTimePicker
                        locale="us-US"
                        value={dateTo}
                        // timeZoneOffsetInMinutes={0}
                        // timeZoneOffsetInSeconds={0}
                        mode={'time'}
                        // minimumDate={dateMin}
                        // is24Hour={true}
                        display="spinner"
                        onChange={onChangeTo}
                        textColor="black"
                      />
                    ) : (
                      <View style={{alignItems: 'center'}}>
                        <DatePicker
                          locale="us-US"
                          // timeZoneOffsetInMinutes={0}
                          // timeZoneOffsetInSeconds={0}
                          date={dateTo}
                          androidVariant={'nativeAndroid'}
                          // is24hourSource="locale"
                          mode={'time'}
                          // minimumDate={dateMin}
                          textColor="black"
                          onDateChange={onChangeTo}
                        />
                      </View>
                    )
                  ) : null}
                </View>
              </View>
              <View style={styles.timeBlock}>
                <Text style={styles.labelTime}>Day</Text>
                <View style={styles.weekRow}>
                  <Text style={styles.dayOn}>
                    {selectedDays.length > 0 ? 'On' : 'Off'}
                  </Text>
                  {selectedDays.length > 0 ? (
                    selectedDays.map((item, index) => {
                      if (selectedDays.length === index + 1) {
                        return (
                          <Text key={index} style={styles.week}>
                            {item}
                          </Text>
                        );
                      } else {
                        return (
                          <Text key={index} style={styles.week}>
                            {item},{' '}
                          </Text>
                        );
                      }
                    })
                  ) : (
                    <Text style={styles.week}>Not selected days</Text>
                  )}
                </View>
                <View>
                  <ButtonGroup
                    onPress={(prevState) => {
                      setSelectedIndex([...prevState]);
                      showDays([...prevState]);
                    }}
                    selectedIndexes={selectedIndex}
                    buttons={weekMini}
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
            onPress={handleSave}
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
    marginBottom: Platform.OS === 'ios' ? 50 : 20,
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
    marginRight: 22,
  },
  week: {
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
