import config from 'commons/config';
import db from 'sources/db.inner';

import {
  SWError,
  customPromptCreater,
  customPublicKeyCreater,
  customUpdateSubscribeCreater,
  listenSWError,
  listenServerPush,
  swInit,
  pushInit
} from './sw.boot';

// #region console

/* eslint-disable */

// 日志
const log = (...rest) => {
  if (config.state.isDebug) {
    console.log('[Simple]', ...rest);
  }
};

// 警告
const warn = (...rest) => {
  console.warn('[Simple]', ...rest);
};

// 错误
const error = (...rest) => {
  console.error('[Simple]', ...rest);
};

/* eslint-enable */

// #endregion

// 自定义应用安装横幅事件
const customInstallPrompt = () => {
  // 拦截应用安装横幅事件
  let installPrompt = (deferredPrompt) => {
    // 提前询问以避免用户直接拒绝造成永远不再触发
    if (confirm('是否将应用安装至桌面？')) {
      log('InstallPrompt:', 'resolve');

      // 最新的 Chrome 必须通过用户触发才能安装
      document.addEventListener('click', () => {
        // 触发应用安装横幅
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          log('InstallPrompt:', choiceResult.outcome, deferredPrompt.platforms);
        });
      });
    }
    else {
      log('InstallPrompt:', 'reject');
    }
  };

  // 监听应用安装横幅事件
  window.addEventListener('beforeinstallprompt', (event) => {
    // 阻止 Chrome 67 及其之前的版本弹出安装提示
    event.preventDefault();
    // 延时处理，避免阻塞主线程
    setTimeout(() => {
      installPrompt(event);
    }, 1 * 1000);
    return false;
  });

  // 监听应用已安装事件
  window.addEventListener('appinstalled', () => {
    log('InstallPrompt:', 'installed');
  });
};

// 监听网络变化
const networkHandler = () => {
  // 检测在线/离线状态
  let onlineHandler = () => {
    let state = 'unknown';
    if (typeof (navigator.onLine) !== 'undefined') {
      state = navigator.onLine ? 'online' : 'offline';
    }
    log('NetworkState:', state);
  };
  window.addEventListener('online', onlineHandler);
  window.addEventListener('offline', onlineHandler);

  // 检测网络链接类型
  let changeHandler = () => {
    let type = 'unknown';
    let downlinkMax = 'unknown';
    let rtt = 'unknown';
    if (navigator.connection) {
      type = navigator.connection.type;
      downlinkMax = navigator.connection.downlinkMax;
      rtt = navigator.connection.rtt;
    }
    log('NetworkInformation:', type, downlinkMax, rtt);
  };
  if (navigator.connection) {
    navigator.connection.addEventListener('change', changeHandler);
  }

  // 立即检查
  onlineHandler();
  changeHandler();
};

// 监听 SW 错误
const swErrorHandler = () => {
  listenSWError((type, err) => {
    error(type, err);
  });
};

// 初始化 SW
const initSW = () => {
  // 自定义刷新提示
  customPromptCreater(() => {
    log('PromptCreater:', 'new');

    return new Promise((resolve, reject) => {
      // 延时处理，避免阻塞主线程
      setTimeout(() => {
        if (confirm('应用有更新，是否立即刷新？')) {
          log('PromptCreater:', 'resolve');

          resolve();
        }
        else {
          log('PromptCreater:', 'reject');

          reject(new SWError('PromptCreater:reject'));
        }
      }, 1 * 1000);
    });
  });

  // 初始化 SW
  return swInit();
};

// 初始化 Push
const initPush = () => {
  // 用户标识
  let identifier = 'default';

  // 自定义创建公钥
  customPublicKeyCreater(() => {
    log('PublicKeyCreater:', 'new');

    return new Promise((resolve, reject) => {
      db.push.getKey({
        identifier: identifier
      }).then((content) => {
        log('PublicKeyCreater:', 'resolve');

        let key = content.data.publicKey;
        resolve(key);
      }).catch((error) => {
        log('PublicKeyCreater:', 'reject');

        reject(error);
      });
    });
  });

  // 自定义更新订阅
  customUpdateSubscribeCreater((subscription) => {
    log('UpdateSubscribeCreater:', 'new');

    return new Promise((resolve, reject) => {
      db.push.subscription({
        identifier: identifier,
        subscription: subscription.toJSON()
      }).then((content) => {
        log('UpdateSubscribeCreater:', 'resolve');

        let ret = content.data;
        log('Subscription updated:', ret);
        resolve(ret);
      }).catch((error) => {
        log('UpdateSubscribeCreater:', 'reject');

        reject(error);
      });
    });
  });

  // 监听推送消息
  listenServerPush((pushData) => {
    log('listenServerPush:', pushData);
  });

  // 初始化 Push
  return pushInit();
};

// 如果启用 PWA
if (config.sw.enablePwa) {
  // 自定义应用安装横幅事件
  customInstallPrompt();

  // 监听网络变化
  networkHandler();

  // 初始化 SW
  let p = initSW();

  // 监听 SW 错误
  p = p.then(swErrorHandler);

  // 如果启用推送
  if (config.sw.enablePush) {
    // 初始化 Push
    p = p.then(initPush);
  }

  // 处理异常
  p.catch((err) => {
    // 当  Promise.reject() 时 err 不存在
    if (err) {
      // 非 SWError 异常进行提示
      if (!(err instanceof SWError)) {
        error(err);
      }
    }
  });
}
