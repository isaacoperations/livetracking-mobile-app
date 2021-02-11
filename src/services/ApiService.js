import {useContext} from 'react';
import axios from 'axios';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

import APIConfig from '../config';
import {UserContext} from '../context/context';

export const useData = () => {
  const user = useContext(UserContext);
  const {
    authData: {idToken, tokenType},
    app_metadata,
  } = user;

  axios.defaults.baseURL = APIConfig.BASE_URL;
  axios.defaults.headers.common.Authorization = `${tokenType} ${idToken}`;
  axios.defaults.headers.common['FACTORY-ID'] = app_metadata?.factories[1]?.id;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.get['Content-Type'] = 'application/json';

  const responseBody = (response) => camelcaseKeys(response, {deep: true});
  const responseError = (error) => {
    console.error(error);
    throw error;
  };

  const requests = {
    get: async (url) =>
      await axios.get(url).then(responseBody).catch(responseError),

    post: async (url, body = {}, headers = {}, snakeCase = true) =>
      await axios
        .post(url, snakeCase ? snakecaseKeys(body, {deep: true}) : body, {
          ...headers,
        })
        .then(responseBody)
        .catch(responseError),

    put: async (url, body) =>
      await axios
        .put(url, snakecaseKeys(body, {deep: true}))
        .then(responseBody)
        .catch(responseError),

    delete: async (url) =>
      await axios.delete(url).then(responseBody).catch(responseError),

    patch: async (url, body) =>
      await axios
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
};
