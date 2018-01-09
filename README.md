# 项目说明

脚手架，基于 [webpack](https://github.com/webpack/webpack) 搭建。  

注意：  
react-router v4 API不兼容老版本  
react-hot-loader v3 API不兼容老版本  

# 分支说明

react 使用 [react](https://github.com/facebook/react) 作为 View 层。  
react-antd 使用 [ant-design](https://github.com/ant-design/ant-design) 作为 UI 库。  
react-antd-mobile 使用 [ant-design-mobile](https://github.com/ant-design/ant-design-mobile) 作为 UI 库。  
react-ts 使用 [react](https://github.com/facebook/react) 作为 View 层，使用 [typescript](https://www.typescriptlang.org/) 作为书写语法。  

# 目录结构

cfg/ webpack 配置文件目录。  
dist/ 构建文件目录。  
src/ 源文件目录。  
.babelrc Babel 配置文件。  
.eslintrc ESLint 配置文件。  
.gitignore Git 配置文件。  
.postcssrc PostCSS 配置。  
gulpfile.js Gulp 配置文件。  
package.json 项目配置文件。  

# 常用命令

建议以 package.json 文件的 scripts 节点作为命令行入口。  

npm run check 检查 Git 分支名与 package.json 版本号是否一致。 
npm run clean 清理构建目录和临时文件。  
npm run latest 复制当前版本至 latest 目录。  
npm run compress 压缩当前版本为 zip 文件。  
npm run serve 启动本地静态服务器（开发环境）。[或 gulp serve --env=dev](#sigint-信号量)  
npm run build:dev 构建项目（开发环境）。  
npm run build:test 构建项目（测试环境）。  
npm run build:prod 构建项目（生产环境）。  

# 脚手架配置

配置信息放置于 package.json 文件的 scaffoldConfig 节点。  
```javascript
{
  "dev": { // 开发环境配置
    "port": 8000, // 服务器端口
    "https": false, // 启用 HTTPS 模式
    "rpc": { // 后端接口配置（包含协议和域名的绝对路径）
      "innerMode": "mock", // inner 接口模式 <mock|proxy|remote>
      "innerPrefix": "[protocol]://[domain]/[path]/" // inner 接口路径（ proxy 或 remote 模式下使用）
    }
  },
  "test": { // 测试环境配置
    "pagePrefix": "//[domain]/[path]/", // 项目页面路径（绝对路径）
    "assetPrefix": "//[domain]/[path]/", // 项目页面路径（绝对路径）
    "rpcPrefix": { // 项目页面路径（绝对路径）
      "inner": "//[domain]/[path]/" // inner 接口路径
    }
  },
  "prod": { // 生产环境配置
    "pagePrefix": "//[domain]/[path]/", // 项目页面路径（绝对路径）
    "assetPrefix": "//[domain]/[path]/", // 项目页面路径（绝对路径）
    "rpcPrefix": { // 项目页面路径（绝对路径）
      "inner": "//[domain]/[path]/" // inner 接口路径
    }
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

## 加载异常

~~仍未解决的问题，表现为在 modules[moduleId].call(...) 处出现 Cannot read property 'call' of undefined 异常。  
发现其 moduleId 并未存在于 modules 中，有可能是该模块被去重或提取至某一个 bundle 中，而该 bundle 未能在被使用前及时加载。  
在 webpack 1 中，找不到好的解决方案，在 webpack 2 中已经移除。只能禁用 webpack.optimize.DedupePlugin 插件，稍感欣慰的是，似乎打包后文件并没有大很多。  
参考：  
[Uncaught TypeError: Cannot read property 'call' of undefined](https://github.com/webpack/webpack/issues/959)  
[配置 .babelrc 不起作用](https://github.com/ant-design/babel-plugin-import/issues/81)  
[atool-build开启watch功能后，使用该插件会报模块找不到的错误](https://github.com/ant-design/babel-plugin-import/issues/97)  
[removed DedupePlugin](https://github.com/webpack/webpack/pull/3266)~~  

## 样式异常

~~暂时绕过去的问题，表现为在启用 extract-text-webpack-plugin 后，使用 require.ensure 进行 Code Splitting 操作时，会丢失按需加载组件中的部分样式。  
发现在按需加载的组件中，通过 import 方式引入的 less 文件，有些会抛出 doesn't export content 错误，有些能正常引入（似乎是 src 下的文件），有些无法引入（似乎是 antd-mobile 下的文件），没有找到规律。  
测试了一下，应该能排除 babel-plugin-import 和 CSS Modules 的嫌疑。在配置 extract-text-webpack-plugin 的 allChunks 属性，将全部样式提取至入口文件后，暂时绕过了该问题。~~  
上面的问题在更新依赖后似乎已经修复，但又出现新的问题。异步模块中依赖的样式会在，开发服务器启动后且未触发模块热更新之前，抛出 Cannot read property 'call' of undefined 异常。  
综合自己调试和第三方资料后，推测是由于丢失了 css-loader 和 style-loader 依赖项造成的，目前相对简单和友好的解决方案，还是设置 allChunks 为 true 的方式。  
参考：  
[Webpack2 + ExtractTextWebpackPlugin + Code Split produce only the last part of the css](https://github.com/webpack/webpack/issues/2763)  
[Extract Text Plugin: require.ensure() causes incomplete file (Webpack 2)](https://github.com/webpack/webpack/issues/2450)  
[Extract text plugin with code splitting](https://github.com/webpack/extract-text-webpack-plugin/issues/208)  
[ExtractTextPlugin extracts from asynchronous split point chunks](https://github.com/webpack/extract-text-webpack-plugin/issues/120)  
[[bug] async js chunks that include scss imports cause => Uncaught (in promise) TypeError: Cannot read property 'call' of undefined](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/456)  

## SIGINT 信号量

执行 npm run xxx 会启动子进程，但在触发 Ctrl + C 后 npm 并未将 SIGINT 信号量传播至子进程。  
造成主进程虽已结束，但子进程却残留下来，表现为 webpack-dev-server 监听端口被占用。  
如果出现此情况，就需要绕过 npm 直接调用 xxx 命令。  
参考：  
[passing unix signals to child rather than dying](https://github.com/npm/npm/issues/4603)  

## react-hot-loader 生产环境配置

生产环境打包文件中，含有本地磁盘路径，是由于 react-hot-loader 的 react-hot-loader/babel 配置中，需要检测 ```NODE_ENV=production``` 环境变量。  
但 Babel 插件代码并未在 Webpack 的处理范围内，需要单独配置 node 环境变量 ```cross-env NODE_ENV=production```。  

参考：  
[react-hot-loader 3 babel plugin cased to the bundle.js size increased.](https://github.com/gaearon/react-hot-loader/issues/357)  
[contains file path in production build with webpack](https://github.com/gaearon/react-hot-loader/issues/630)  

## webpack-dev-server 热更新

当在 CLI 和 Node API 中使用 webpack-dev-server 时，根据使用方式不同，需要进行不同配置。  
在 CLI 中，使用 --hot 会自动启用 HotModuleReplacementPlugin 插件，并在 entry 中添加热更新代码。  
在 Node API 中，需手工配置插件，并添加热更新代码（或使用 webpackDevServer.addDevServerEntrypoints 添加热更新代码）。

参考：  
[Minimalize differences between CLI and Node.js API](https://github.com/webpack/webpack-dev-server/issues/616)  
[Setting WDS Entry Points Manually](https://survivejs.com/webpack/appendices/hmr/#setting-wds-entry-points-manually)  
[Via the Node.js API](https://webpack.js.org/guides/hot-module-replacement/#via-the-node-js-api)  

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
