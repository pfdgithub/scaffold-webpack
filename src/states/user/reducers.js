import { combineReducers } from 'redux';

import { UPDATE_ACCOUNT } from './actions';

// 是否已登录
const isLogined = (state = false, action) => {
  let { type, payload } = action;

  if (type === UPDATE_ACCOUNT) {
    return !!(payload && payload.mobile);
  }

  return state;
};

// 账户信息
const account = (state = {
  mobile: '',
  userName: ''
}, action) => {
  let { type, payload } = action;

  if (type === UPDATE_ACCOUNT) {
    return Object.assign({}, payload);
  }

  return state;
};

const user = combineReducers({
  isLogined,
  account
});

export default user;
