import config from 'commons/config';

// 检查支持状态
let checkFeature = () => {
  if ('serviceWorker' in navigator) {
    return Promise.resolve();
  }
  else {
    return Promise.reject('Unsupported serviceWorker');
  }
};

// 注册 service worker
let registerSW = () => {
  let swPath = `${config.public.pagePath}sw.js`; // service worker 文件路径

  return navigator.serviceWorker.register(
    swPath
  ).then((registration) => {
    /* eslint-disable */
    console.log('Registration: ', registration);
    /* eslint-enable */

    // 监听新 service worker 安装
    registration.addEventListener('updatefound', () => {
      // If updatefound is fired, it means that there's
      // a new service worker being installed.
      let installingWorker = registration.installing;
      /* eslint-disable */
      console.log('A new service worker is being installed:', installingWorker);
      /* eslint-enable */
    });

    return Promise.resolve(registration);
  }).catch((registrationError) => {
    /* eslint-disable */
    console.error('Registration failed: ', registrationError);
    /* eslint-enable */

    return Promise.reject(registrationError);
  });
};

// 订阅 push
let subscribePush = (registration) => {
  let options = {
    userVisibleOnly: true,
    applicationServerKey: null
  };

  return registration.pushManager.subscribe(
    options
  ).then((subscription) => {
    /* eslint-disable */
    console.log('Subscription: ', subscription);
    /* eslint-enable */

    return Promise.resolve(subscription);
  }).catch((subscriptionError) => {
    /* eslint-disable */
    console.error('Subscription failed: ', subscriptionError);
    /* eslint-enable */

    return Promise.reject(subscriptionError);
  });
};

// 入口
let main = () => {
  checkFeature()
    .then(registerSW)
    // .then(subscribePush)
    .catch((err) => {
      /* eslint-disable */
      console.error(err);
      /* eslint-enable */
    });
};

main();
