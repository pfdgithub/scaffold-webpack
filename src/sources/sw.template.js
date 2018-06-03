/**
 * 该文件不会被 webpack 解析，运行在 service worker 线程中。
 */
/* global workbox */

// #region console

// 日志
const log = (...rest) => {
  /* eslint-disable */
  // https://github.com/GoogleChrome/workbox/blob/master/packages/workbox-core/models/LogLevels.mjs
  if (workbox.core.logLevel <= 1) {
    console.log('[SW]', ...rest);
  }
  /* eslint-enable */
};

// 警告
const warn = (...rest) => {
  /* eslint-disable */
  console.warn('[SW]', ...rest);
  /* eslint-enable */
};

// 错误
const error = (...rest) => {
  /* eslint-disable */
  console.error('[SW]', ...rest);
  /* eslint-enable */
};

// #endregion

// #region 双向通讯

// 监听客户端消息
const listenClientMsg = (cb, filter) => {
  self.addEventListener('message', (event) => {
    let data = event.data;
    if (!data) {
      return;
    }
    if (data.from !== 'app') {
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

//  给客户端发消息
const postClientMsg = (client, message, transfer) => {
  message = Object.assign({
    from: 'serviceWorker'
  }, message);
  client.postMessage(message, transfer);
};

//  给客户端发消息
const postClientsMsg = (clientList, message, transfer) => {
  (clientList || []).forEach((client) => {
    postClientMsg(client, message, transfer);
  });
};

// 过滤客户端
const filterClients = (type, urlRegExp) => {
  return clients.matchAll({
    type: type || 'all',
    includeUncontrolled: true
  }).then((clientList) => {
    if (urlRegExp) {
      let list = [];
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.search(urlRegExp) > -1) {
          list.push(client);
        }
      }
      return list;
    }
    else {
      return clientList;
    }
  });
};

// #endregion

// #region 初始化配置

// 获取外部配置
let appConfig;
listenClientMsg((msgData) => {
  let config = msgData.data;
  log('AppConfig:', config);

  appConfig = config;
}, { type: 'appConfig' });

// 跳过等待阶段
listenClientMsg((msgData) => {
  let page = msgData.data;
  log('SkipWaiting:', page);

  self.skipWaiting();
}, { type: 'skipWaiting' });

// 监听事件
self.addEventListener('install', (event) => {
  log('Install Event:', event);
});

self.addEventListener('activate', (event) => {
  log('Activate Event:', event);
});

// #endregion

// #region 缓存策略

/**
 * 预缓存
 */
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  ignoreUrlParametersMatching: [/^_/] // 忽略以 _ 开头的请求参数
});

/**
 * CacheFirst
 * 若有缓存则直接返回。若无缓存则发起请求，返回请求结果，并将结果写入缓存。
 */
workbox.routing.registerRoute(
  /_strategies=cacheFirst/,
  workbox.strategies.cacheFirst()
);

/**
 * CacheOnly
 * 只使用缓存
 */
workbox.routing.registerRoute(
  /_strategies=cacheOnly/,
  workbox.strategies.cacheOnly()
);

/**
 * NetworkFirst
 * 直接发起请求。若请求成功则返回结果，并将结果写入缓存。若请求失败则返回缓存。
 */
workbox.routing.registerRoute(
  /_strategies=networkFirst/,
  workbox.strategies.networkFirst()
);

/**
 * NetworkOnly
 * 只使用网络
 */
workbox.routing.registerRoute(
  /_strategies=networkOnly/,
  workbox.strategies.networkOnly()
);

/**
 * StaleWhileRevalidate
 * 若有缓存则直接返回，并在后台发起请求，将结果写入缓存。若无缓存则发起请求，返回请求结果，并将结果写入缓存。
 */
workbox.routing.registerRoute(
  /_strategies=staleWhileRevalidate/,
  workbox.strategies.staleWhileRevalidate()
);

// #endregion

// #region 服务器推送

// 监听推送事件
self.addEventListener('push', (event) => {
  log('Push Event:', event);

  let pushJson = {};
  let pushText = '';
  try {
    pushJson = event.data.json();
  } catch (error) {
    pushText = event.data.text();
  }

  // 有客户端开启，就给客户端发消息，否则发系统通知
  let scope = (appConfig && appConfig.public.pagePath) || '/';
  let p = filterClients('window', new RegExp(scope))
    .then((clientList) => {
      log('Filter Clients:', clientList);

      if (clientList.length > 0) {
        // 给客户端发消息
        postClientsMsg(clientList, {
          type: 'serverPush',
          data: pushJson
        });

        return Promise.resolve();
      }
      else {
        // 发系统通知
        let title = pushJson.title || '';
        let options = {
          body: pushJson.body || pushText,
          data: pushJson.data,
          tag: pushJson.tag,
          badge: pushJson.badge,
          image: pushJson.image,
          requireInteraction: pushJson.requireInteraction,
          icon: pushJson.icon || (appConfig ? appConfig.sw.noticeIcon : undefined)
        };

        return self.registration.showNotification(title, options);
      }
    });

  event.waitUntil(p);
});

// 点击系统通知
self.addEventListener('notificationclick', (event) => {
  log('Notificationclick Event:', event);

  event.notification.close();
  let pushData = event.notification.data;

  // 只有在用户触发的操作中才允许聚焦或打开客户端
  // 有客户端开启，就给客户端发消息，否则打开客户端
  let scope = (appConfig && appConfig.public.pagePath) || '/';
  let p = filterClients('window', new RegExp(scope))
    .then((clientList) => {
      log('Filter Clients:', clientList);

      if (clientList.length > 0) {
        // 给客户端发消息
        postClientsMsg(clientList, {
          type: 'serverPush',
          data: pushData
        });

        // 聚焦第一个客户端
        return clientList[0].focus();
      }
      else {
        // 打开客户端
        return clients.openWindow(scope);
      }
    });

  event.waitUntil(p);
});

// 关闭系统通知
self.addEventListener('notificationclose', (event) => {
  log('Notificationclose Event:', event);
});

// #endregion

log('Start');