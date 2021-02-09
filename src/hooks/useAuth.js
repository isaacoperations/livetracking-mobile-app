import {useReducer, useMemo, useEffect} from 'react';
import RNSInfo from 'react-native-sensitive-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth0 from 'react-native-auth0';

import {createAction} from '../utils/createAction';
import {sleep} from '../utils/sleep';
import reducer, {initialState} from '../reducer/reducer';

import {credentials} from '../config/auth0-configuration';

export function useAuth() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const auth0 = new Auth0(credentials);

  const auth = useMemo(
    () => ({
      login: async (email, password) => {
        await auth0.auth
          .passwordRealm({
            username: email,
            password: password,
            realm: 'Username-Password-Authentication',
            scope: 'openid profile',
          })
          .then(async (data) => {
            await auth0.auth
              .userInfo({token: data.accessToken})
              .then(async (user) => {
                const userData = {
                  token: data.accessToken,
                  authData: data,
                  userData: user,
                  app_metadata: user['https://livetracking.ca/app_metadata'].organizations[0],
                  user_metadata: user['https://livetracking.ca/user_metadata'],
                };
                await RNSInfo.setItem('user', JSON.stringify(userData), {});
                dispatch(createAction('SET_USER', userData));
              });
          });
      },
      logout: async () => {
        await RNSInfo.deleteItem('user', {});
        await AsyncStorage.removeItem('line');
        dispatch(createAction('REMOVE_USER'));
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    sleep(2000).then(async () => {
      await RNSInfo.getItem('user', {}).then((user) => {
        if (user) {
          dispatch(createAction('SET_USER', JSON.parse(user)));
        }
        dispatch(createAction('SET_LOADING', false));
      });
    });
  }, []);
  return {auth, state};
}
