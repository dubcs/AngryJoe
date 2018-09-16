import {
SET_VAN_LOCATION,
GET_VAN_LOCATION,
REQUEST_CHANGE,
SUBMIT_REQUEST,
REQUEST_ADMIN,
ADMIN_SUCCESS,
LOGOUT,
LOGOUT_SUCCESS,
SHUT_OFF_VAN,
GET_TOGGLE,
UPDATE_VAN_LOCATION,
UPDATE_TOGGLE,
TOGGLE_TRUE,
TOGGLE_FALSE,
} from '../actions/types';

const INITIAL_STATE = {
  joe:{},
  admin: false,
  request:'',
  toogle: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_VAN_LOCATION:
        return { ...state };
    case UPDATE_VAN_LOCATION:
          return { ...state, joe:action.payload};
    case GET_VAN_LOCATION:
        return { ...state, joe: action.payload};
    case REQUEST_CHANGE:
        return { ...state, request: action.payload };
    case SUBMIT_REQUEST:
        return state;
    case REQUEST_ADMIN:
      return {...state, admin:false};
    case ADMIN_SUCCESS:
      return {...state, admin: action.payload};
    case LOGOUT:
      return state;
    case SHUT_OFF_VAN:
      return {...state, toggle: action.payload};
    case GET_TOGGLE:
      return {...state, toggle: action.payload}
    case UPDATE_TOGGLE:
        return {...state, toggle: action.payload}
    case TOGGLE_TRUE:
        return {...state, toggle: true}
    case TOGGLE_FALSE:
        return {...state, toggle: false}
    default:
      return state;
  }
};
