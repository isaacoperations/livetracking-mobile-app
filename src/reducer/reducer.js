export const initialState = {
  loading: true,
  user: null,
  factory: '',
  badge: false,
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

    case 'SET_FACTORY':
      return {
        ...state,
        factory: action.payload,
      };

    case 'SET_BADGE':
      return {
        ...state,
        badge: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
