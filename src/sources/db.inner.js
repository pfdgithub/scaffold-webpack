import nattyFetch from './db.global';
import config from 'commons/config';

const context = nattyFetch.context({
  withCredentials: true,
  urlPrefix: config.public.rpcPath.inner,
  urlSuffix: '.json',
  fit: (response) => {
    let obj = response ? response : {};
    return {
      success: obj.code === 0,
      error: {
        raw: response,
        message: obj.message ? obj.message : '操作失败，请稍后重试。'
      },
      content: {
        raw: response,
        data: obj.data ? obj.data : {}
      }
    };
  }
});

// 上下文事件
context.on('resolve', (/*err, cfg*/) => {
});
context.on('reject', (err/*, cfg, vars*/) => {
  // 处理网络层错误
  let status = err.status;
  let message = err.message;

  if (typeof (status) !== 'undefined') {
    if (status === 0) {
      message = `当前网络不可用`;
    }
    else {
      message = `操作失败，状态码 ${status}`;
    }
  }

  err.message = message;
});
context.on('error', (/*err, cfg*/) => {
});

// 传统风格接口
context.create('legacy', {
  // 状态检查
  'state': {
    method: 'GET',
    url: 'legacy/state'
  }
});

// REST 风格接口
context.create('rest', {
  // 状态检查
  'state': {
    method: 'GET',
    url: 'rest/:state',
    rest: true,
    header: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
});

// 推送接口
context.create('push', {
  // 获取订阅密钥
  'getKey': {
    method: 'POST',
    url: 'push/getKey',
    header: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  },
  // 更新服务器订阅
  'subscription': {
    method: 'POST',
    url: 'push/subscription',
    header: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  },
  // 推送消息
  'sendMsg': {
    method: 'POST',
    url: 'push/sendMsg',
    header: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
});

// 输出上下文的所有接口
export default context.api;