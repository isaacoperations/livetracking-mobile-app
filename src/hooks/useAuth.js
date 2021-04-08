import {useReducer, useMemo, useEffect} from 'react';
import RNSInfo from 'react-native-sensitive-info';
import Auth0 from 'react-native-auth0';
import Config from 'react-native-config';
import RNRestart from 'react-native-restart';

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
            realm: Config.AUTHO_REALM,
            scope: Config.AUTHO_SCOPE_ALL,
          })
          .then(async (data) => {
            await auth0.auth
              .userInfo({token: data.accessToken})
              .then(async (user) => {
                const userData = {
                  token: data.accessToken,
                  authData: data,
                  userData: user,
                  app_metadata:
                    user['https://livetracking.ca/app_metadata']
                      .organizations[0],
                  user_metadata: user['https://livetracking.ca/user_metadata'],
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
      refreshTokens: async () => {
        await RNSInfo.getItem('user', {}).then(async (userData) => {
          const data = JSON.parse(userData);
          console.log('data', data);
          await auth0.auth
            .refreshToken({
              refreshToken: data.authData.refreshToken,
              scope: Config.AUTHO_SCOPE_ALL,
            })
            .then(async (newAccessToken) => {
              await auth0.auth
                .userInfo({token: newAccessToken.accessToken})
                .then(async (user) => {
                  const payload = {
                    token: newAccessToken.accessToken,
                    authData: newAccessToken,
                    userData: user,
                    app_metadata:
                      user['https://livetracking.ca/app_metadata']
                        .organizations[0],
                    user_metadata:
                      user['https://livetracking.ca/user_metadata'],
                  };
                  await RNSInfo.setItem('user', JSON.stringify(payload), {});
                  dispatch(createAction('SET_USER', payload));
                  RNRestart.Restart();
                });
            })
            .catch(async (err) => {
              console.log('refresh user err', err);
              await auth0.auth
                .revoke({refreshToken: data.authData.refreshToken})
                .then((revoke) => {
                  console.log('user revoke', revoke);
                  // const payload = {
                  //   token: newAccessToken.accessToken,
                  //   authData: newAccessToken,
                  //   userData: user,
                  //   app_metadata:
                  //     user['https://livetracking.ca/app_metadata']
                  //       .organizations[0],
                  //   user_metadata:
                  //     user['https://livetracking.ca/user_metadata'],
                  // };
                  // await RNSInfo.setItem('user', JSON.stringify(payload), {});
                  // dispatch(createAction('SET_USER', payload));
                  // RNRestart.Restart();
                })
                .catch((error) => {
                  console.log('err revoke', error);
                });
              // THIS LOGOUT
              await RNSInfo.deleteItem('user', {});
              dispatch(createAction('REMOVE_USER'));
            });
        });
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
