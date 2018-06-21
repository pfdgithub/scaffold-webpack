import config from 'commons/config';
import db from 'sources/db.inner';

import {
  customPromptCreater,
  customPublicKeyCreater,
  customUpdateSubscribeCreater,
  listenServerPush,
  swInit,
  pushInit
} from './sw.boot';

// #region console

/* eslint-disable */

// 日志
const log = (...rest) => {
  if (config.state.isDebug) {
    console.log('[APP]', ...rest);
  }
};

// 警告
const warn = (...rest) => {
  console.warn('[APP]', ...rest);
};

// 错误
const error = (...rest) => {
  console.error('[APP]', ...rest);
};

/* eslint-enable */

// #endregion

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
    p = p.then(() => {
      return pushInit();
    });
  }

  // 处理异常
  p.catch((err) => {
    err && error(err);
  });
}
