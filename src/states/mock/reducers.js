import { combineReducers } from 'redux';

import { FETCH_LEGACY, FETCH_REST } from './actions';

// 传统风格接口
const legacy = (state = {}, action) => {
  let { type, payload } = action;

  if (type === FETCH_LEGACY) {
    return Object.assign({}, payload);
  }

  return state;
};

// REST 风格接口
const rest = (state = {}, action) => {
  let { type, payload } = action;

  if (type === FETCH_REST) {
    return Object.assign({}, payload);
  }

  return state;
};

const mock = combineReducers({
  legacy,
  rest
});

export default mock;
