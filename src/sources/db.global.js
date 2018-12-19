/**
 * nattyFetch 为单例模式，全局共享同一实例。
 * 参数说明 https://github.com/jias/natty-fetch/blob/master/docs/options.md
 */

import nattyFetch from 'natty-fetch';
import report from 'commons/report';

// 日志
/* eslint-disable */
const log = (type, ...rest) => {
  if (type == 'resolve') {
    // console.info('nattyFetch', type, rest);
  } else if (type == 'reject') {
    // console.warn('nattyFetch', type, rest);
  }
  else if (type == 'error') {
    console.error('nattyFetch', type, rest);
  }
  else {
    // console.log('nattyFetch', type, rest);
  }
};
/* eslint-enable */

// 检查 status
const checkStatus = (err) => {
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

  return message;
};

// 检查登录
let willGotoLogin = false;
const checkLogin = (err, cfg) => {
  // 尝试查找错误码
  let raw = err.raw;
  let code = raw ? raw.code : err.code;

  // 无效登录状态
  if (
    code === 10001 // 标准错误码
  ) {
    // 是否忽略登录检测
    if (!(cfg && cfg.query && cfg.query._ignoreCheckLogin)) {
      // 避免多次弹窗
      if (!willGotoLogin) {
        willGotoLogin = true;

        // 弹窗提醒
        if (confirm('未登录或登录超时，请重新登陆。')) {
          willGotoLogin = false; // 重置状态

          /* eslint-disable */
          console.warn('请提供登录方案');
          /* eslint-enable */
        }
      }
    }

    return true;
  }

  return false;
};

// 全局事件
nattyFetch.on('resolve', (data, cfg) => {
  log('resolve', data, cfg);
});
nattyFetch.on('reject', (err, cfg, vars) => {
  log('reject', err, cfg, vars);

  // 处理网络层错误
  let message = checkStatus(err);

  // 处理未登录跳转
  let loginCode = checkLogin(err, cfg, vars);

  // 不上报未登录日志
  if (!loginCode) {
    // 日志上报
    report.warning(`[nattyFetch] ${message}`, {
      tags: {
        nattyFetch: 'reject'
      },
      extra: {
        error: err,
        config: cfg,
        vars: vars
      }
    });
  }

  err.message = message;
});
nattyFetch.on('error', (err, cfg) => {
  log('error', err, cfg);

  // 处理网络层错误
  let message = checkStatus(err);

  // 日志上报
  report.error(`[nattyFetch] ${message}`, {
    tags: {
      nattyFetch: 'error'
    },
    extra: {
      error: err,
      config: cfg
    }
  });

  err.message = message;
});

// 全局配置
nattyFetch.setGlobal({
  // 请求的固定参数。
  data: {
  },
  // 请求执行完成后的回调函数。
  didFetch: (vars, cfg) => {
    log('didFetch', vars, cfg);
  },
  // 数据结构预处理函数。
  fit: (response, vars) => {
    log('fit', response, vars);

    return response;
  },
  // 自定义ajax请求的头部信息。
  header: {
    // 'Content-Type': 'application/json; charset=utf-8'
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  },
  // 是否忽略接口自身的并发请求，即是否开启请求锁。
  ignoreSelfConcurrent: false,
  // 请求方式是否使用jsonp。
  jsonp: false,
  // 用于实现jsonp的script标签是否要加上crossorigin属性。
  jsonpCrossOrigin: false,
  // 配置ajax的请求方式。
  method: 'GET',
  // 是否开启mock模式。
  mock: false,
  // mock模式开启时的请求地址。
  mockUrl: '',
  // mock模式开启时的请求地址前缀，如果mockUrl的值是"绝对路径"或"相对路径"，则不会自动添加该前缀。
  mockUrlPrefix: '',
  // 全局`mockUrl`后缀
  mockUrlSuffix: '',
  // 是否取消上一次没有完成的请求。
  overrideSelfConcurrent: false,
  // 配置可用的插件。
  plugins: [
  ],
  // method 设置为 POST 时采用何种格式向服务端发送数据。
  postDataFormat: 'FORM',
  // 请求成功时的数据处理函数，该函数接收到的参数是下文的"数据结构约定"中content的值。
  process: (content, vars) => {
    log('process', content, vars);

    return content;
  },
  // 追加到url上的queryString的值。
  query: {
  },
  // 是否开启RESTFul API接口风格。如果开启，在调用接口时传入的:号开头的参数会被填充到url中。
  rest: false,
  // 在请求失败(网络错误，超时，success为false等)时是否进行请求重试。
  retry: 0,
  // 是否开启缓存功能。
  storage: false,
  // 超时时间，0表示不启动超时处理。
  timeout: 0,
  // 和jQuery/Zepto的param方法的第二个参数一样的效果。
  traditional: false,
  // 请求地址。
  url: '',
  // 追加标记信息
  urlMark: false,
  // 请求地址前缀，如果url的值是"绝对路径"或"相对路径"，则不会自动添加该前缀。
  urlPrefix: '',
  // 全局`url`后缀
  urlSuffix: '',
  // 是否在url的search中加入时间戳(__stamp)参数，屏蔽浏览器默认的缓存(304)机制。
  urlStamp: true,
  // 请求执行前的回调函数。
  willFetch: (vars, cfg, from) => {
    log('willFetch', vars, cfg, from);
  },
  // 是否发送cookie，natty-fetch内部已经通过判断url是否跨域来自动设置该值，所以不建议手动设置。
  withCredentials: null
});

export default nattyFetch;