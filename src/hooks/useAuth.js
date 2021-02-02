import {useReducer, useMemo, useEffect} from 'react';
import RNSInfo from 'react-native-sensitive-info';
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
                  email: user.email ? user.email : 'user@livetracking.io',
                  token: data.accessToken,
                  picture: user.picture || '',
                };
                await RNSInfo.setItem('user', JSON.stringify(userData), {});
                dispatch(createAction('SET_USER', userData));
              });
          });
      },
      logout: async () => {
        await RNSInfo.deleteItem('user', {});
        dispatch(createAction('REMOVE_USER'));
      },
    }),
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
