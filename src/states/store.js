import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import config from 'commons/config';

import rootReducer from './reducers';

// 创建唯一 Store
const configureStore = (preloadedState) => {
  let enhancer = applyMiddleware(thunk);
  if (config.state.isDebug) {
    // 输出日志
    enhancer = applyMiddleware(thunk, logger);
    // 调试工具
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      enhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(enhancer);
    }
  }

  let store = createStore(rootReducer, preloadedState, enhancer);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
};

export default configureStore;