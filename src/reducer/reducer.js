export const initialState = {
  loading: true,
  user: null,
  line: [],
};

const reducer = (state, action) => {
  console.log('action reducer', state, action);
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

    case 'SET_LINE':
      return {
        ...state,
        line: [...action.payload],
      };

    case 'REMOVE_LINE':
      return {
        ...state,
        line: [],
      };

    default:
      return state;
  }
};

export default reducer;
