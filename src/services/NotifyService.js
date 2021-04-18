import APIConfig from '../config';

export const getDataNotify = async (url) => {
  return await fetch(APIConfig.NOTIFY_URL + url);
};
