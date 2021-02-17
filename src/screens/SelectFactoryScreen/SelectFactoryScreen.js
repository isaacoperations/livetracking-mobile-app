import React, {useContext, useEffect, useReducer, useState} from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {THEME} from '../../constants/theme';
import HeaderStatus from '../../components/HeaderStatus';
import {ModalHeader} from '../../components/ModalHeader';
import {SelectFactoryItem} from './components/SelectFactoryItem';
import {UserContext} from '../../context/context';
import reducer, {initialState} from '../../reducer/reducer';
import {createAction} from '../../utils/createAction';

export function SelectFactoryScreen({navigation}) {
  const user = useContext(UserContext);
  const [{factory}, dispatch] = useReducer(reducer, initialState);
  const {
    app_metadata: {factories},
  } = user;
  console.log('factoryID nnnnnn', factory);
  const [selected, setSelected] = useState(factory);
  console.log('setSelected setSelected', selected);
  useEffect(() => {
    (async () => {
      if (await AsyncStorage.getItem('factoryID')) {
        await AsyncStorage.getItem('factoryID').then((id) => {
          const num = Number(id);
          console.log('ffafafaffa', num);
          setSelected(num);
          dispatch(createAction('SET_FACTORY', num));
        });
      } else {
        console.log('not ffafafaffa');
        setSelected(factory);
      }
      console.log('setSelected setSelected', selected);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const requestFactoryId = async (id) => {
    await AsyncStorage.setItem('factoryID', id.toString());
    console.log('handleClick', id);
    setSelected(id);
    dispatch(createAction('SET_FACTORY', id));
  };

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={'Select Factory'}
          onPressClose={() => navigation.goBack()}
          onPressSetting={() => navigation.navigate('Setting')}
          iconShow={true}
          iconColor={THEME.DARK_COLOR}
          iconTitleSetting={'settings'}
          backgroundColor={'#EDF0F3'}
        />
        <ScrollView>
          {factories.map((item, index) => (
            <SelectFactoryItem
              key={index}
              id={index}
              onPress={() => requestFactoryId(index)}
              title={item.name}
              description={item.id}
              isActive={selected}
            />
          ))}
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
