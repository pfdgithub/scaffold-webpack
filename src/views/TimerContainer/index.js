import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let _container = null; // 单例容器

const init = (props) => { // 初始化
  if (_container === null) {
    _container = document.createElement('div');
    document.body.appendChild(_container);
    ReactDOM.render(<App {...props} />, _container);
  }
};

const destroy = () => { // 销毁
  if (_container !== null) {
    ReactDOM.unmountComponentAtNode(_container);
    _container.parentNode.removeChild(_container);
    _container = null;
  }
};

export default {
  init,
  destroy
};