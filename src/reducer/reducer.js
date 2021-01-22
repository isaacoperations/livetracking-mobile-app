export const initialState = {
  loading: true,
  user: null,
};

const reducer = (state, action) => {
  console.log('action reducer', action);
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: {...action.payload},
      };
    case 'REMOVE_USER':
      return {
        ...state,
        user: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
