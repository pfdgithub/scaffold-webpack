import Raven from 'raven-js';
import config from './config';

// 设置用户信息
const setUserContext = (opt) => {
  // opt 不存在将删除所有用户信息
  Raven.setUserContext(opt);
};

// 设置全局 Tags
const setTagsContext = (opt) => {
  opt = opt ? opt : {}; // opt 不存在将删除所有 Tags
  Raven.setTagsContext(opt);
};

// 设置全局 Extra
const setExtraContext = (opt) => {
  opt = opt ? opt : {}; // opt 不存在将删除所有 Extra
  Raven.setExtraContext(opt);
};

// 捕获消息
const captureMessage = (msg, opt) => {
  Raven.captureMessage(msg, opt);
};

// 捕获异常
const captureException = (e, opt) => {
  Raven.captureException(e, opt);
};

// 捕获信息
const info = (msg, opt) => {
  if (!config.raven.disableInfo) {
    captureMessage(msg, Object.assign({
      level: 'info'
    }, opt));
  }
};

// 捕获警告
const warning = (msg, opt) => {
  captureMessage(msg, Object.assign({
    level: 'warning'
  }, opt));
};

// 捕获错误
const error = (msg, opt) => {
  captureMessage(msg, Object.assign({
    level: 'error'
  }, opt));
};

// 捕获异常
const exception = (e, opt) => {
  captureException(e, opt);
};

// 初始化页面载入阶段
const initPageLoad = () => {
  let stageTimestamp = {
    init: 0,

    loading: 0,
    interactive: 0,
    complete: 0,

    DOMContentLoaded: 0,
    load: 0
  };

  let pageLoad = (stage) => {
    info(`[pageLoad] ${stage}`, {
      tags: {
        pageLoad: stage
      },
      extra: {
        stageTimestamp: stageTimestamp
      }
    });
  };

  // 初始化
  stageTimestamp['init'] = Date.now();

  // 原生事件
  let _onreadystatechange = document.onreadystatechange;
  document.onreadystatechange = () => {
    _onreadystatechange && _onreadystatechange();

    stageTimestamp[document.readyState] = Date.now();
  };
  document.addEventListener('DOMContentLoaded', () => {
    stageTimestamp['DOMContentLoaded'] = Date.now();
  }, false);
  window.addEventListener('load', () => {
    stageTimestamp['load'] = Date.now();

    pageLoad('load');
  }, false);
};

// 初始化日志上报
const init = () => {
  // 初始化配置
  Raven.config(
    config.raven.dsn,
    {
      environment: config.state.env,
      release: config.state.ver,
      tags: {
        userAgent: navigator.userAgent
      }
    }
  ).install();

  // 初始化页面载入阶段
  initPageLoad();
};

// 启用日志上报
if (config.raven.dsn && config.raven.enabledRaven) {
  init();
}

export default {
  setUserContext,
  setTagsContext,
  setExtraContext,
  captureMessage,
  captureException,
  info,
  warning,
  error,
  exception
};
