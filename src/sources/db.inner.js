import nattyFetch from './db.global';
import config from 'commons/config';

let context = nattyFetch.context({
  withCredentials: true,
  urlPrefix: config.public.rpcPath.inner,
  urlSuffix: '.json',
  plugins: [
    nattyFetch.plugin.soon
  ],
  fit: (response) => {
    let obj = response ? response : {};
    return {
      success: obj.code === 0,
      error: {
        raw: response,
        message: (obj.code > 0 && obj.message) ? obj.message : '网络错误，请稍后重试。'
      },
      content: {
        raw: response,
        data: obj.data ? obj.data : {}
      }
    };
  }
});

// 上下文事件
let lock = false; // 注意，一个页面只会初始化一次
context.on('reject', (err/*, cfg*/) => {
  if (err.code === 10001) {
    let message = err.message || '当前未登陆或登陆超时，请重新登陆。';

    if (!lock) {
      lock = true;
      alert(message);
      lock = false;
    }
  }
  else if (err.code === 10002) {
    let message = err.message || '权限不够，无法访问当前页面。';

    if (!lock) {
      lock = true;
      alert(message);
      lock = false;
    }  
  }
});
context.on('reject', (/*err, cfg*/) => {
});
context.on('error', (/*err, cfg*/) => {
});

context.create('test', {
  // 状态检查
  'state': {
    method: 'POST',
    url: 'test/state'
  }
});

// 输出上下文的所有接口
export default context.api;
