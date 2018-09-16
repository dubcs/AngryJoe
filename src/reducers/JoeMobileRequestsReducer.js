import {
  GET_REQUESTS
  } from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REQUESTS:
      return {...state, requests:action.payload};
    default:
      return state;
  }
};
