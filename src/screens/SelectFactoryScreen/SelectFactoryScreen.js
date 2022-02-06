import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
  Fragment,
} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import {THEME} from '../../constants/theme';
import HeaderStatus from '../../components/HeaderStatus';
import {ModalHeader} from '../../components/ModalHeader';
import {SelectFactoryItem} from './components/SelectFactoryItem';
import {UserContext} from '../../context/context';
import reducer, {initialState} from '../../reducer/reducer';
import {createAction} from '../../utils/createAction';
import {sleep} from '../../utils/sleep';
import {useData} from '../../services/ApiService';

export function SelectFactoryScreen({navigation, route}) {
  const user = useContext(UserContext);
  const [{factory}, dispatch] = useReducer(reducer, initialState);

  const {ApiService} = useData();
  const organizations =
    user.userData['https://livetracking.ca/app_metadata'].organizations;
  const factoriesData = user.app_metadata?.factories[0]?.id;
  const [selected, setSelected] = useState(factory);
  const [debounce, setDebounce] = useState(false);
  useEffect(() => {
    (async () => {
      crashlytics().log('Select factory - screen');
      await AsyncStorage.getItem('factoryID').then((data) => {
        if (data) {
          const {factoryId} = JSON.parse(data);
          setSelected(factoryId);
          dispatch(createAction('SET_FACTORY', factoryId));
        } else {
          setSelected(factoriesData);
        }
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const requestFactoryId = async (id, url, name) => {
    setDebounce(true);
    const payloadData = {
      factoryId: id,
      factoryName: name,
      factoryUrl: url,
    };
    await AsyncStorage.setItem('factoryID', JSON.stringify(payloadData));
    AsyncStorage.removeItem('@reportFilters');
    setSelected(id);
    dispatch(createAction('SET_FACTORY', id));
    sleep(500)
      .then(async () => {
        //TODO Extract to a service
        const tokenFB = await AsyncStorage.getItem('tokenDevice');
        const tokenDeviceAPN = await AsyncStorage.getItem('tokenDeviceAPNs');
        const bindingID = await AsyncStorage.getItem('bindingId');
        if (Platform.OS === 'android' && tokenFB && !bindingID) {
          await ApiService.bindDevice({
            binding_type: 'fcm',
            address: tokenFB,
            user_auth0_id: user?.userData?.sub,
          })
            .then(async ({data}) => {
              await AsyncStorage.setItem('bindingId', data.bindingId);
            })
            .catch((err) => {
              console.log('[Notification] Bind err: ', err);
            });
        } else if (Platform.OS === 'ios' && tokenDeviceAPN && !bindingID) {
          await ApiService.bindDevice({
            binding_type: 'apn',
            address: tokenDeviceAPN,
            user_auth0_id: user?.userData?.sub,
          })
            .then(async ({data}) => {
              await AsyncStorage.setItem('bindingId', data.bindingId);
            })
            .catch((err) => {
              console.log('[Notification] Bind err: ', err);
            });
        }
        setDebounce(false);
      })
      .finally(() => {
        navigation.goBack();
      });
  };

  console.log('debounce', debounce);

  let idx = 0;

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={'Select Factory'}
          onPressClose={() => {
            crashlytics().log('Select factory - goBack');
            navigation.goBack();
          }}
          onPressSetting={() => {
            crashlytics().log('Select factory - Setting');
            navigation.navigate('Setting');
          }}
          iconShow={true}
          iconColor={THEME.DARK_COLOR}
          iconTitleSetting={'settings'}
          backgroundColor={'#EDF0F3'}
        />
        <ScrollView>
          {organizations.map((organization) => {
            idx++;
            return (
              <Fragment key={idx}>
                {organization.factories.map((item, index) => {
                  return (
                    <SelectFactoryItem
                      key={idx + index}
                      id={item.id}
                      disabled={debounce}
                      onPress={() =>
                        requestFactoryId(item.id, item.url, item.name)
                      }
                      title={organization.name}
                      description={item.name}
                      isActive={selected}
                    />
                  );
                })}
              </Fragment>
            );
          })}
        </ScrollView>
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
});
