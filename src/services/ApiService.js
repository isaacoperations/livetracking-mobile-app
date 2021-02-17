import {useContext, useReducer} from 'react';
import axios from 'axios';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import AsyncStorage from '@react-native-async-storage/async-storage';

import APIConfig from '../config';
import {UserContext} from '../context/context';
import {createAction} from '../utils/createAction';
import reducer, {initialState} from '../reducer/reducer';

export function useData() {
  const user = useContext(UserContext);
  const [{factory}, dispatch] = useReducer(reducer, initialState);
  const {
    authData: {idToken, tokenType},
    app_metadata,
  } = user;

  console.log('factoryID ----------', factory);

  const customAxios = axios.create({
    baseURL: APIConfig.BASE_URL,
    headers: {
      Authorization: `${tokenType} ${idToken}`,
      'Content-Type': 'application/json',
    },
  });

  //axios.defaults.baseURL = APIConfig.BASE_URL;
  //axios.defaults.headers.common.Authorization = `${tokenType} ${idToken}`;
  //axios.defaults.headers.common['FACTORY-ID'] = app_metadata?.factories[tempID]?.id;
  //axios.defaults.headers.common['Content-Type'] = 'application/json';

  const requestHandler = async (request) => {
    console.log('requestHandler ----------', factory);
    if (await AsyncStorage.getItem('factoryID')) {
      await AsyncStorage.getItem('factoryID').then((id) => {
        const num = Number(id);
        console.log('ffafafaffa', num);
        dispatch(createAction('SET_FACTORY', num));
        request.headers.common['FACTORY-ID'] = app_metadata?.factories[num]?.id;
      });
    } else {
      console.log('not ffafafaffa');
      request.headers.common['FACTORY-ID'] =
        app_metadata?.factories[factory]?.id;
    }
    //request.headers.common['FACTORY-ID'] = app_metadata?.factories[factory]?.id;
    return request;
  };

  const responseHandler = (response) => {
    console.log('response response ------------------------', response);
    return response;
  };

  const errorHandler = (error) => {
    const {status, data} = error.response;
    console.log('config error ------------------------', status, data);
    return Promise.reject(error);
  };

  customAxios.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error),
  );

  customAxios.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error),
  );

  const responseBody = (response) => camelcaseKeys(response, {deep: true});
  const responseError = (error) => {
    console.log('responseError', error.response);
    console.error(error);
    throw error;
  };

  const requests = {
    get: async (url) =>
      await customAxios.get(url).then(responseBody).catch(responseError),

    post: async (url, body = {}, headers = {}, snakeCase = true) =>
      await customAxios
        .post(url, snakeCase ? snakecaseKeys(body, {deep: true}) : body, {
          ...headers,
        })
        .then(responseBody)
        .catch(responseError),

    put: async (url, body) =>
      await customAxios
        .put(url, snakecaseKeys(body, {deep: true}))
        .then(responseBody)
        .catch(responseError),

    delete: async (url) =>
      await customAxios.delete(url).then(responseBody).catch(responseError),

    patch: async (url, body) =>
      await customAxios
        .patch(url, snakecaseKeys(body, {deep: true}))
        .then(responseBody)
        .catch(responseError),
  };

  // TODO: could be expanded on further to handle .then()s
  const LiveView = {
    getByLineId: (runId) => requests.get(`/mobile/reporting/run/${runId}`),
    getAllLine: () => requests.get('/mobile/liveview/all'),
  };

  return {LiveView};
}
