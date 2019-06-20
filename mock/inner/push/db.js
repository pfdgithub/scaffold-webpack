// 推送配置
const pushOptions = {
  // proxy: 'http://127.0.0.1:8388' // 使用代理访问 FCM 服务器
};

// 公私钥对
const keys = {
  'default': {
    "publicKey": "BL-PAiIjr_PssAlYdxyQI30dgZbLz-jLx8AylYEb_W8oQ_RLCYikqMI5KZXqSGwaAzxJtqITArsvf_L7jrQ6rP0",
    "privateKey": "jNU4vWEE-xzuKqZ_6HLgqdxY0oWEuioJn-1miDCLmZ0"
  }
};

// 订阅列表
const subscriptions = {
  'default': []
};

// 获取密钥
const getKey = (identifier) => {
  return keys[identifier];
};

// 订阅
const subscribe = (identifier, subscription) => {
  let list = subscriptions[identifier];
  list = list || [];

  let idx = list.findIndex((item) => {
    return item.endpoint === subscription.endpoint;
  });

  if (idx === -1) {
    list.push(subscription);
  }
  else {
    list[idx] = subscription;
  }

  subscriptions[identifier] = list;
};

// 取消订阅
const unsubscribe = (identifier, subscription) => {
  let list = subscriptions[identifier];
  list = list || [];

  list = list.filter((item) => {
    return item.endpoint !== subscription.endpoint;
  });

  subscriptions[identifier] = list;
};

// 遍历订阅
const traversal = (identifier, cb) => {
  let list = subscriptions[identifier];
  list = list || [];

  list.forEach(cb);
};

module.exports = {
  pushOptions,
  getKey,
  subscribe,
  unsubscribe,
  traversal
};