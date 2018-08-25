# Web 推送概述

推送服务器由浏览器厂商指定，基于 [Web Push Protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol) 规范实现。  
应用调用浏览器提供的 [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) 获得 [endpoint](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription/endpoint) 等信息，并提交至应用服务器。  
应用服务器选择相应开发语言的 [web-push-libs](https://github.com/web-push-libs) 将业务数据，提交至 endpoint 指定的推送服务器。  

注意：  
Chrome 和 Firefox 的推送服务器由 [FCM](https://firebase.google.com/) 提供，请确保应用和应用服务器能正常链接到推送服务器。  

# Web Push library for Node.js

在 Node.js 中使用 [web-push](https://github.com/web-push-libs/web-push) 实现推送。  

公私钥对:  
```bash
web-push generate-vapid-keys --json
```

应用订阅：  

```javascript
navigator.serviceWorker.ready.then((registration) => {
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array('<publicKey>')
  }).then((subscription) => {
    let pushSubscription = subscription.toJSON();
  });
});
```

应用服务器推送：  
```javascript
let payload = JSON.stringify('<message>');
webpush.sendNotification(pushSubscription, payload);
```

推送服务器响应码：  
| Status Code | Description |
| - | - |
| 201 | Created. The request to send a push message was received and accepted. |
| 429 | Too many requests. Meaning your application server has reached a rate limit with a push service. The push service should include a 'Retry-After' header to indicate how long before another request can be made. |
| 400 | Invalid request. This generally means one of your headers is invalid or improperly formatted. |
| 404 | Not Found. This is an indication that the subscription is expired and can't be used. In this case you should delete the `PushSubscription` and wait for the client to resubscribe the user. |
| 410 | Gone. The subscription is no longer valid and should be removed from application server. This can be reproduced by calling `unsubscribe()` on a `PushSubscription`. |
| 413 | Payload size too large. The minimum size payload a push service must support is 4096 bytes (or 4kb). |

# 参考资料

[Web Push Notifications](https://developers.google.cn/web/fundamentals/push-notifications/)  
[Adding Push Notifications to a Web App](https://developers.google.com/web/fundamentals/codelabs/push-notifications/)  
[Ensuring Push Messaging is used for Notifications](https://docs.google.com/document/d/13VxFdLJbMwxHrvnpDm8RXnU41W2ZlcP0mdWWe9zXQT8/edit)  
[Push Companion](https://web-push-codelab.glitch.me/)  
