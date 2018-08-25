/**
 * 请勿将 <Provider /> 至于 react-hot-loader 之后，否则会报错：
 * <Provider> does not support changing `store` on the fly.
 * It is most likely that you see this error because you updated to Redux 2.x and React Redux 2.x which no longer hot reload reducers automatically.
 * See https://github.com/reactjs/react-redux/releases/tag/v2.0.0 for the migration instructions.
 */

import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'states/store';

import App from './AppHot';

const store = configureStore();

const AppProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppProvider;