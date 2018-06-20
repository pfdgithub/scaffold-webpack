import { combineReducers } from 'redux';

import { FETCH_PENDING, FETCH_FULFILLED, FETCH_REJECTED } from './actions';

// 请求状态
const fetchState = (state = {}, action) => {
  let { type, payload } = action;

  if (type === FETCH_PENDING) {
    let { url, param } = payload;

    return Object.assign({}, state, {
      url,
      param,
      data: null,
      error: null
    });
  }
  else if (type === FETCH_FULFILLED) {
    return Object.assign({}, state, {
      data: payload
    });
  }
  else if (type === FETCH_REJECTED) {
    return Object.assign({}, state, {
      error: payload
    });
  }

  return state;
};

const global = combineReducers({
  fetchState
});

export default global;
