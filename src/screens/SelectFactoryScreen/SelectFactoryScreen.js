import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
  Fragment,
} from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
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

export function SelectFactoryScreen({navigation}) {
  const user = useContext(UserContext);
  const [{factory}, dispatch] = useReducer(reducer, initialState);
  const organizations =
    user.userData['https://livetracking.ca/app_metadata'].organizations;
  const factoriesData = user.app_metadata?.factories[0]?.id;
  const [selected, setSelected] = useState(factory);
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
    const data = {
      factoryId: id,
      factoryName: name,
      factoryUrl: url,
    };
    await AsyncStorage.setItem('factoryID', JSON.stringify(data));
    setSelected(id);
    dispatch(createAction('SET_FACTORY', id));
    sleep(500).then(() => {
      navigation.goBack();
    });
  };

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
                      onPress={() => requestFactoryId(item.id, item.url, item.name)}
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
