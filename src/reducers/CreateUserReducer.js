import { CREATE_EMAIL_CHANGED
    , CREATE_PASSWORD_CHANGED,
    SAVE_USER_SUCCESS,
    SAVE_USER_FAIL,
    SAVE_USER,
    CREATE_USERNAME_CHANGED,
    CREATE_FIRST_NAME_CHANGED,
    CREATE_LAST_NAME_CHANGED,
  } from '../actions/types';


const INITIAL_STATE = {
  user: null,
  email: '',
  password: '',
  username: '',
  error: '',
  firstname:'',
  lastname:'',
  loading: false,
  loggedIn:false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case CREATE_PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case CREATE_USERNAME_CHANGED:
      return { ...state, username: action.payload };
    case CREATE_FIRST_NAME_CHANGED:
      return { ...state, firstname: action.payload };
    case CREATE_LAST_NAME_CHANGED:
      return { ...state, lastname: action.payload };

    case SAVE_USER_SUCCESS:
        return { ...state,
          user: action.payload,
          error: '',
          loading: false,
          password: '',
          email: ''
         };
    case SAVE_USER_FAIL:
        return { ...state, error: action.payload};
    case SAVE_USER:
        return { ...state, loggedIn: true, error: '' };
    default:
        return state;
  }
};
