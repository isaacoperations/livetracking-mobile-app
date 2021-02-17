import {useReducer, useMemo, useEffect} from 'react';
import RNSInfo from 'react-native-sensitive-info';

import {createAction} from '../utils/createAction';
import {sleep} from '../utils/sleep';
import reducer, {initialState} from '../reducer/reducer';

export function useLine() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const line = useMemo(
    () => ({
      getLine: async (data) => {
        await RNSInfo.setItem('line', JSON.stringify(data), {});
        dispatch(createAction('SET_LINE', data));
      },
      removeLine: async () => {
        await RNSInfo.deleteItem('line', {});
        dispatch(createAction('REMOVE_line'));
      },
    }),
    [],
  );
  useEffect(() => {
    sleep(2000).then(async () => {
      await RNSInfo.getItem('line', {}).then((item) => {
        if (item) {
          dispatch(createAction('SET_LINE', JSON.parse(item)));
        }
      });
    });
  }, []);
  return {state, line};
}
