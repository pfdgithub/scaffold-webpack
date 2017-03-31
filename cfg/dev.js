let webpack = require('webpack');

let devServer = require('./devServer');
let defaults = require('./defaults');
let base = require('./base');

// 模拟数据路径前缀
let mockPathPrefix = '/mocks/';
// 本地代理路径前缀
let proxyPathPrefix = '/proxy/';
// 远程服务器地址前缀（如 //[domain]/ 等）
let remoteServerPrefix = `${defaults.https ? 'https' : 'http'}://127.0.0.1:${defaults.port}/`;

// 项目页面路径
let publicPagePath = '/';
// 项目资源路径
let publicAssetPath = `/${defaults.version}/${defaults.assetDir}/`;
// 后端接口路径
let publicRpcPath = {
  /**
   * 访问 mocks 目录下的模拟接口（如 /mocks/[path]/ 等）
   * 使用 js/json 实现 动态/静态 数据模拟
   */
  inner: `${mockPathPrefix}inner/`
  /**
   * 直接访问远程服务器的接口（如 //[domain]/[path]/ 等）
   * 根据实际情况，远程服务器可能需要支持跨域请求
   */
  // inner: `${remoteServerPrefix}mocks/inner/`
  /**
   * 代理访问远程服务器的接口（如 /proxy/[path]/ 等）
   * 此时 remoteServerPrefix 必须含有协议头（如 http:// 等）
   */
  // inner: `${proxyPathPrefix}mocks/inner/`
};
// 入口页面对象
let publicPageFullname = defaults.getPublicPageFullname(publicPagePath);

// 获取入口配置
let getEntries = () => {
  let newEntries = {};

  for (let key in base.entry) {
    newEntries[key] = [
      `webpack-dev-server/client?${defaults.https ? 'https' : 'http'}://127.0.0.1:${defaults.port}/`, // Automatic Refresh - Inline mode
      'webpack/hot/only-dev-server' // Automatic Refresh - Hot Module Replacement
    ].concat(base.entry[key]);
  }

  return newEntries;
};

// 获取加载器
let getModules = () => {
  let rules = base.module.rules;
  rules.forEach((rule) => {
    let enforce = rule.enforce;
    let test = rule.test;
    let use = rule.use;
    // 找到处理 .js 和 .jsx 文件的普通 loader 后在其 use 数组中添加新的 loader
    if ((enforce === undefined || enforce === '' || enforce === 'normal')
      && (Object.prototype.toString.call(test) === '[object RegExp]' && test.source === '\\.(js|jsx)$') //注意转义字符
      && Object.prototype.toString.call(use) === '[object Array]') {
      // 在数组顶部添加
      use.unshift({
        loader: 'react-hot-loader'
      });
    }
  });

  return base.module;
};

// 获取插件
let getPlugins = () => {
  let param = defaults.getDefinePluginParam({
    defineEnv: 'dev',
    defineDebug: true,
    publicPagePath,
    publicAssetPath,
    publicRpcPath,
    publicPageFullname
  });

  return [].concat(
    base.plugins,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(param),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      minimize: false,
      context: __dirname
    })
  );
};

// 修改基础配置
let config = base;

config.cache = true;
config.devtool = 'cheap-module-source-map';
config.output.pathinfo = true;
config.output.publicPath = publicAssetPath;
config.entry = getEntries();
config.module = getModules();
config.plugins = getPlugins();
config.devServer = devServer({
  publicPath: publicAssetPath,
  mockPrefix: mockPathPrefix,
  proxyPrefix: proxyPathPrefix,
  proxyTarget: remoteServerPrefix
});

module.exports = config;