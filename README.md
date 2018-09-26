# 项目说明

脚手架，基于 [webpack](https://github.com/webpack/webpack) 搭建。  

# 分支说明

react 使用 [react](https://github.com/facebook/react) 作为 View 层。  
react-antd 使用 [ant-design](https://github.com/ant-design/ant-design) 作为 UI 库。  
react-antd-mobile 使用 [ant-design-mobile](https://github.com/ant-design/ant-design-mobile) 作为 UI 库。  

# 目录结构

**请注意阅读每个目录下的 README.md 文件。**  

cfg/ webpack 配置文件目录。  
dist/ 构建文件目录。  
mock/ 模拟数据目录。  
src/ 源文件目录。  
.browserslistrc Browserslist 配置文件。  
.editorconfig 编辑器配置文件。  
.eslintrc ESLint 配置文件。  
.gitignore Git 配置文件。  
babel.config.js Babel 配置文件。  
postcss.config.js PostCSS 配置。  
gulpfile.js Gulp 配置文件。  
package.json 项目配置文件。  

# 常用命令

建议以 package.json 文件的 scripts 节点作为命令行入口。  

npm run check 检查 Git 分支名与 package.json 版本号是否一致。  
npm run clean 清理构建目录和临时文件。  
npm run imagemin 压缩源文件的图片。  
npm run compress 压缩构建目录为 zip 文件。  
npm run serve 启动本地静态服务器（开发环境）。[或 gulp serve --env=dev](#sigint-信号量)  
npm run build:dev 构建项目（开发环境）。  
npm run build:test 构建项目（测试环境）。  
npm run build:prod 构建项目（生产环境）。  

# 脚手架配置

配置信息放置于 package.json 文件的 scaffold 节点。  
```javascript
{
  "deploy": { // 部署配置
    "portalMultiVersion": false, // 是否将项目页面放置于版本目录
    "portalMinifyHtml": false, // 是否压缩项目页面 HTML 代码
    "portalBeautifyHtml": false, // 是否格式化项目页面 HTML 代码
    "portalChunkHash": false, // 是否在项目页面内的资源路径中使用 Hash
    "assetMultiVersion": false, // 是否将项目资源放置于版本目录
    "assetNameHash": false, // 是否在项目资源名中使用 Hash
    "assetExtractCss": false, // 是否提取 CSS 资源
    "enablePwa": false, // 是否启用 PWA 支持
    "enablePush": false, // 是否启用推送支持
    "manifest": {} // Web App Manifest 配置
  },
  "dev": { // 开发环境配置
    "port": 8000, // 服务器端口
    "https": false, // 是否启用 HTTPS 模式
    "devtool": "cheap-module-eval-source-map", // source maps 选项
    "historyApi": false, // historyApiFallback 选项
    "rpcMode": "mock", // 接口模式 <mock|proxy|remote>
    "rpcPrefix": { // 后端接口路径（在 proxy 或 remote 模式下使用，必须为包含协议和域名的绝对路径）
      "inner": "https://[host]/[path]/" // inner 接口路径
    },
    "deploy": {} // 覆盖部署配置
  },
  "test": { // 测试环境配置
    "pagePrefix": "https://[host]/[path]/", // 项目页面路径（绝对路径）
    "assetPrefix": "https://[host]/[path]/", // 项目资源路径（绝对路径）
    "rpcPrefix": { // 后端接口路径（绝对路径）
      "inner": "https://[host]/[path]/" // inner 接口路径
    },
    "deploy": {} // 覆盖部署配置
  },
  "prod": { // 生产环境配置
    "pagePrefix": "https://[host]/[path]/", // 项目页面路径（绝对路径）
    "assetPrefix": "https://[host]/[path]/", // 项目资源路径（绝对路径）
    "rpcPrefix": { // 后端接口路径（绝对路径）
      "inner": "https://[host]/[path]/" // inner 接口路径
    },
    "deploy": {} // 覆盖部署配置
  }
}
```

# 注意事项

## 兼容处理

适度使用 ES6 和 ES7 语法，使用前需检查 Babel 支持程度。根据情况选择 core-js babel-plugin-transform-runtime babel-polyfill 做兼容处理。  
对于低版本浏览器的支持，可能还需要 es5-shim es5-sham console-polyfill JSON 做兼容处理。  
默认情况下 Babel 只转换“语法”，不转换“内置函数”、“静态方法”、“实例方法”。  
使用 core-js 可有针对性的选择需要使用的“内置函数”、“静态方法”、“实例方法”，并可控制是否注入全局命名空间，但维护量工作量较大。  
使用 babel-plugin-transform-runtime 配合 babel-runtime 可支持“内置函数”、“静态方法”，不污染全局命名空间，适用于开发工具库。  
使用 babel-polyfill 可大而全的支持“内置函数”、“静态方法”、“实例方法”，但会污染全局命名空间，适用于开发应用程序。  
参考：  
[core-js](https://github.com/zloirock/core-js)  
[Runtime transform](http://babeljs.io/docs/plugins/transform-runtime/)  
[Polyfill](http://babeljs.io/docs/usage/polyfill/)  
[babel的polyfill和runtime的区别](https://segmentfault.com/q/1010000005596587)  
[Babel下的ES6兼容性与规范](http://imweb.io/topic/561f9352883ae3ed25e400f5)  
[react 项目的一个ie8兼容性问题](http://www.aliued.com/?p=3240)  
[如何区分Babel中的stage-0,stage-1,stage-2以及stage-3（一）](http://www.cnblogs.com/flyingzl/p/5501247.html)  
[如何区分Babel中的stage-0,stage-1,stage-2以及stage-3（二）](http://www.cnblogs.com/flyingzl/p/5504203.html)  
[ES6 + Webpack + React + Babel 如何在低版本浏览器上愉快的玩耍(上)](https://yq.aliyun.com/articles/59107)  
[ES6 + Webpack + React + Babel 如何在低版本浏览器上愉快的玩耍(下)](https://yq.aliyun.com/articles/60724)  
[Babel: configuring standard library and helpers](https://leanpub.com/setting-up-es6/read#ch_babel-helpers-standard-library)  

## SIGINT 信号量

执行 npm run xxx 会启动子进程，但在触发 Ctrl + C 后 npm 并未将 SIGINT 信号量传播至子进程。  
造成主进程虽已结束，但子进程却残留下来，表现为 webpack-dev-server 监听端口被占用。  
如果出现此情况，就需要绕过 npm 直接调用 xxx 命令。  
参考：  
[passing unix signals to child rather than dying](https://github.com/npm/npm/issues/4603)  

## Service Workers

使用此特性，需要站点运行在 https 环境或 localhost 域下。  
使用 ```navigator.serviceWorker.register('/sw.js')``` 注册的 ```sw.js``` 文件，其所在的路径就它的作用域。  
更新 ```sw.js``` 时，不能变更其加载路径，因为浏览器只会在同一路径检查更新。  

参考：  
[Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)  
[Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/)  
[The Offline Cookbook](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/)  

# 其他资料

## hosts 文件
Windows C:\windows\system32\drivers\etc\hosts  
Mac /private/etc/hosts  
Linux /etc/hosts  

## 白屏优化

从入口页面加载结束到入口脚本执行结束，会有一段白屏时间，要在此时间段内提供加载提示。使用 SVG 和 CSS 动画可尽可能减小入口页面大小，直接放置在页面源码中，不要依赖外部资源文件。  
外部脚本资源全部放置于页脚，外部样式资源目前放置于页头。如果需要尽早显示动画，可考虑将外部样式资源放置于动画 DOM 之后，但要注意避免由此产生的闪屏现象。  

## 线上调试

客户端调试不便，真机调试限制较大。因此在非生产环境中，引入了调试工具。  
当入口页检测到 location.search 中含有 vConsole 字符串后，将加载调试面板脚本。  
参考：  
[vConsole](https://github.com/WechatFE/vConsole)  
[vConsole-resources](https://github.com/WechatFE/vConsole-resources)  
[vConsole-elements](https://github.com/WechatFE/vConsole-elements)  
[vConsole-source](https://github.com/WechatFE/vConsole-source)  
