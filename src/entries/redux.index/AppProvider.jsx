import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'states/store';

import App from './App';

const store = configureStore();

const AppProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

/**
 * states/store 模块已经实现了 store 的热替换，忽略该模块本身的变更。
 * 
 * <Provider> does not support changing `store` on the fly.
 * It is most likely that you see this error because you updated to Redux 2.x and React Redux 2.x which no longer hot reload reducers automatically.
 * See https://github.com/reactjs/react-redux/releases/tag/v2.0.0 for the migration instructions.
 */
if (module.hot) {
  module.hot.decline('states/store');
}

export default AppProvider;