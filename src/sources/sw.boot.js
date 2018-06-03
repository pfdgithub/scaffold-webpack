/**
 * 该文件将会被 webpack 解析，运行在主线程中。
 */

import config from 'commons/config';
import db from 'sources/db.inner';

// #region console

// 日志
const log = (...rest) => {
  /* eslint-disable */
  if (config.state.isDebug) {
    console.log('[APP]', ...rest);
  }
  /* eslint-enable */
};

// 警告
const warn = (...rest) => {
  /* eslint-disable */
  console.warn('[APP]', ...rest);
  /* eslint-enable */
};

// 错误
const error = (...rest) => {
  /* eslint-disable */
  console.error('[APP]', ...rest);
  /* eslint-enable */
};

// #endregion

// #region 双向通讯

// 监听 service worker Container 消息
const listenSWCMsg = (swc, cb, filter) => {
  swc.addEventListener('message', (event) => {
    let data = event.data;
    if (!data) {
      return;
    }
    if (data.from !== 'serviceWorker') {
      return;
    }
    if (filter) {
      for (let key in filter) {
        let val = filter[key];
        if (data[key] !== val) {
          return;
        }
      }
    }

    cb && cb(data);
  });
};

//  给 service worker 发消息
const postSWMsg = (sw, message, transfer) => {
  message = Object.assign({
    from: 'app'
  }, message);
  sw.postMessage(message, transfer);
};

// #endregion

// #region 注册 service worker

// 保留 load 事件
const loadPromise = new Promise((resolve) => {
  window.addEventListener('load', () => {
    resolve();
  });
});

// 检查 service worker
const checkSW = () => {
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      // 监听消息
      listenSWCMsg(navigator.serviceWorker, (msgData) => {
        let pushData = msgData.data;
        log('ServerPush:', pushData);

      }, { type: 'serverPush' });

      loadPromise.then(resolve);
    }
    else {
      warn('Unsupported serviceWorker');
      reject();
    }
  });
};

// 注册 service worker
const registerSW = (swPath) => {
  return navigator.serviceWorker.register(swPath)
    .then((registration) => {
      log('Registration:', registration);

      log('ServiceWorker State:', `installing:${!!registration.installing}`
        , `waiting:${!!registration.waiting}`, `active:${!!registration.active}`);

      // 只处理处于 installing 阶段的 SW
      if (registration.installing) {
        let serviceWorker = registration.installing;
        log('New ServiceWorker Init:', serviceWorker);

        // 传入项目配置
        postSWMsg(serviceWorker, {
          type: 'appConfig',
          data: config
        });
      }

      return Promise.resolve(registration);
    }).catch((registrationError) => {
      warn('Registration failed:', registrationError);

      return Promise.reject(registrationError);
    });
};

// 注销 service worker
const unregisterSW = () => {
  return navigator.serviceWorker.ready
    .then((registration) => {
      return registration.unregister();
    });
};

// #endregion

// #region 更新 service worker

// 主动检查更新 service worker
const updateSW = (timespan = 0, maxCount = 1) => {
  // service worker 已激活
  navigator.serviceWorker.ready
    .then((registration) => {
      if (timespan >= 0) {
        let count = 0;
        let intervalId = setInterval(() => {
          if ((++count) <= maxCount) {
            registration.update();
          }
          else {
            clearInterval(intervalId);
          }
        }, timespan);
      }
    });
};

// 默认刷新提示
let promptCreater = () => {
  // 默认拒绝
  return Promise.reject();
};

// 自定义刷新提示
const customPromptCreater = (creater) => {
  if (typeof (creater) === 'function') {
    log('CustomPromptCreater:', creater);
    promptCreater = creater;
  }
  else {
    error('CustomPromptCreater:', 'creater must be a function that returns promise');
  }
};

// 触发刷新提示
const refreshPrompt = (registration) => {
  // 检查自定义刷新提示是否符合规范
  let p = promptCreater();
  if (p.then && p.catch) { // 检查是否为 Promise
    // 等待用户确认刷新操作
    p.then(() => {
      log('RefreshPrompt:', 'allow');

      log('RefreshPrompt Waiting:', registration.waiting);

      // 只处理处于 waiting 阶段的 SW
      if (registration.waiting) {
        // 要求 SW 跳过 waiting 阶段，将进入 active 阶段
        postSWMsg(registration.waiting, {
          type: 'skipWaiting',
          data: window.location.href
        });
      }
    }).catch(() => {
      warn('RefreshPrompt:', 'block');
    });
  }
};

// 监听 SW 状态变更
const listenSWStateChange = (serviceWorker, state, cb) => {
  serviceWorker.addEventListener('statechange', (event) => {
    log('ServiceWorker Statechange Event:', event.target.state, event);

    if (event.target.state === state) {
      cb && cb();
    }
  });
};

/**
 *  service worker 生命周期中有五种状态 "installing" | "installed" | "activating" | "activated" | "redundant"
 *  registration 中最多可同时存在三个处于不同阶段的 SW 实例 "installing" | "waiting" | "active"
 */

// 处理 SW 更新流程
const handleSWChange = (registration) => {
  // 保留对本页面加载时，处于 installing 阶段的 SW 引用，可能是 null
  let regInstalling = registration.installing;

  // 当 registration.active 属性被赋值为新 SW 时，会触发 controllerchange 事件
  let preventDevToolsReloadLoop = false;
  navigator.serviceWorker.addEventListener('controllerchange', (event) => {
    log('Container Controllerchange Event:', event);

    // 如果当前进入 active 阶段的 SW 就是本页面加载时的那个，忽略后续操作
    if (registration.active === regInstalling) {
      log('Reload Window:', 'abort');
      return;
    }

    // 保证页面只刷新一次，避免开发者工具 force update on reload 选项的 BUG
    if (!preventDevToolsReloadLoop) {
      preventDevToolsReloadLoop = true;
      window.location.reload();
    }
  });

  // 当 registration.installing 属性被赋值为新 SW 时，会触发 updatefound 事件（适用场景：打开一个页面，后台检测到新 SW 文件）
  registration.addEventListener('updatefound', (event) => {
    log('Registration Updatefound Event:', event);

    // 如果当前进入 installing 阶段的 SW 就是本页面加载时的那个，忽略后续操作
    if (registration.installing === regInstalling) {
      log('ListenSWStateChange:', 'abort');
      return;
    }

    // 新 SW 状态变更为 installed 后，由于旧 SW 仍处于 active 阶段，因此新 SW 将进入 waiting 阶段
    listenSWStateChange(registration.installing, 'installed', () => {
      refreshPrompt(registration);
    });
  });

  // 如果 registration 中只有处于 installing 阶段，没有处于 waiting 或 active 阶段的 SW 认为是初次安装
  let isFirstSW = (!!registration.installing) && (!registration.waiting) && (!registration.active);

  log('HandleSWChange IsFirstSW:', isFirstSW);

  // 若当前 SW 是初次安装，则结束 installing 阶段后，将进入 active 阶段，否则进入 waiting 阶段
  if (isFirstSW) {
    return;
  }

  // 如果有 SW 处于 waiting 阶段（适用场景：其他页面已经请求用户刷新，但还没有被允许）
  if (registration.waiting) {
    log('HandleSWChange Waiting:', registration.waiting);

    refreshPrompt(registration);
    return;
  }

  // 如果有 SW 处于 installing 阶段（适用场景：已打开的页面还没有检测到新 SW 文件，但正在打开的页面检测到了）
  if (registration.installing) {
    log('HandleSWChange Installing:', registration.installing);

    // 新 SW 状态变更为 installed 后，由于旧 SW 仍处于 active 阶段，因此新 SW 将进入 waiting 阶段
    listenSWStateChange(registration.installing, 'installed', () => {
      refreshPrompt(registration);
    });
    return;
  }
};

// #endregion

// #region 注册 push

// 字符串转换
const urlB64ToUint8Array = (base64String) => {
  let padding = '='.repeat((4 - base64String.length % 4) % 4);
  let base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  let rawData = window.atob(base64);
  let outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

// 是否有通知权限
const isAgreeNotice = () => {
  // "default" | "denied" | "granted"
  return ('Notification' in window) && (Notification.permission !== 'denied');
};

// 检查 push
const checkPush = () => {
  return new Promise((resolve, reject) => {
    if ('PushManager' in window) {
      // 检查用户是否已授权
      if (isAgreeNotice()) {
        // service worker 已激活
        navigator.serviceWorker.ready.then(resolve);
      }
      else {
        warn('Notification permission denied');
        reject();
      }
    }
    else {
      warn('Unsupported PushManager or Notification');
      reject();
    }
  });
};

// 订阅 push
const subscribePush = (key) => {
  let options = {
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(key)
  };

  // service worker 已激活
  return navigator.serviceWorker.ready
    .then((registration) => {
      // 检查是否已经订阅
      return registration.pushManager.getSubscription()
        .then((subscription) => {
          if (subscription) {
            // 已经订阅
            log('Old Subscription:', subscription);

            return Promise.resolve(subscription);
          }
          else {
            // 需要订阅
            return registration.pushManager.subscribe(options)
              .then((subscription) => {
                log('New Subscription:', subscription);

                return Promise.resolve(subscription);
              }).catch((subscriptionError) => {
                warn('Subscription failed:', subscriptionError);

                return Promise.reject(subscriptionError);
              });
          }
        });
    });
};

// 注销 push
const unsubscribePush = () => {
  return navigator.serviceWorker.ready
    .then((registration) => {
      return registration.pushManager.getSubscription()
        .then((subscription) => {
          if (subscription) {
            return subscription.unsubscribe();
          }
          else {
            return Promise.resolve();
          }
        });
    });
};

// #endregion

// #region 密钥和端点

// 获取订阅密钥
const getAppServerKey = (identifier) => {
  return db.push.getKey({
    identifier: identifier
  }).then((content) => {
    let key = content.data.publicKey;
    log('Subscription Key:', key);

    return key;
  });
};

// 更新服务器订阅
const updateServerSubscription = (identifier, subscription) => {
  let json = subscription.toJSON();
  log('Subscription toJSON:', json);

  return db.push.subscription({
    identifier: identifier,
    subscription: json
  })
    .then((content) => {
      let ret = content.data;
      log('Subscription updated:', ret);

      return ret;
    });
};

// #endregion

// #region 初始化和销毁

// 初始化 service worker
const swInit = () => {
  let swPath = `${config.public.pagePath}${config.sw.swName}`; // service worker 文件路径

  return checkSW()
    .then(() => {
      return registerSW(swPath);
    })
    .then(handleSWChange);
};

// 销毁 service worker
const swDestroy = () => {
  return checkSW()
    .then(unregisterSW);
};

// 初始化 push
const pushInit = (identifier) => {
  return checkPush()
    .then(() => {
      return getAppServerKey(identifier);
    })
    .then(subscribePush)
    .then((subscription) => {
      return updateServerSubscription(identifier, subscription);
    });
};

// 销毁 push
const pushDestroy = () => {
  return checkPush()
    .then(unsubscribePush);
};

// #endregion

// 简单示例
const example = () => {
  // 无效名称认为禁用 PWA
  if (config.sw.swName) {
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
            reject();
          }
        }, 5 * 1000);
      });
    });

    // 初始化 SW
    let p = swInit();

    // 如果启用推送
    if (config.sw.enablePush) {
      // 初始化 Push
      p = p.then(() => {
        return pushInit('default');
      });
    }

    // 处理异常
    p.catch((err) => {
      err && error(err);
    });
  }
};

export default {
  updateSW,
  isAgreeNotice,
  customPromptCreater,

  swInit,
  swDestroy,
  pushInit,
  pushDestroy,

  example
};
