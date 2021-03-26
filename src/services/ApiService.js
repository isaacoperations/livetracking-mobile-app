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
  const [, dispatch] = useReducer(reducer, initialState);
  const {
    authData: {idToken, tokenType},
    app_metadata,
  } = user;

  const customAxios = axios.create({
    baseURL: APIConfig.BASE_URL,
    headers: {
      Authorization: `${tokenType} ${idToken}`,
      'Content-Type': 'application/json',
    },
  });

  const requestHandler = async (request) => {
    console.log('request', request);
    await AsyncStorage.getItem('factoryID').then((data) => {
      if (data) {
        const {factoryId, factoryUrl} = JSON.parse(data);
        dispatch(createAction('SET_FACTORY', factoryId));
        request.headers.common['FACTORY-ID'] = factoryId;
        request.baseURL = factoryUrl;
      } else {
        request.headers.common['FACTORY-ID'] = app_metadata?.factories[0]?.id;
      }
    });

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
    console.log('responseError', error);
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
  const ApiService = {
    getByRunId: (runId) => requests.get(`/mobile/reporting/run/${runId}`),
    getLiveview: () => requests.get('/mobile/liveview/all'),
    getLines: () => requests.get('/line'),
    getProducts: () => requests.get('/product'),
    postReport: (data) => requests.post('/mobile/reporting/daily/range', data),
  };

  return {ApiService};
}
