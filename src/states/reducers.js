import { combineReducers } from 'redux';

import global from './global/reducers';
import mock from './mock/reducers';

const rootReducer = combineReducers({
  global,
  mock
});

export default rootReducer;
