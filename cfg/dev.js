const webpack = require('webpack');
const NameAllModulesPlugin = require('name-all-modules-plugin');

const devServer = require('./devServer');
const defaults = require('./defaults');
const base = require('./base');
const deployCfg = defaults.deployCfg || {};
const devCfg = (defaults.scaffoldCfg && defaults.scaffoldCfg.dev) || {};

// 模拟数据路径前缀
const mockPathPrefix = '/mock/';
// 本地代理路径前缀
const proxyPathPrefix = '/proxy/';
// 代理目标域名（如 [protocol]//[host]/ 等）
let proxyTargetDomain = '';
// inner 接口路径
let innerRpcPath = '';

(() => {
  let innerMode = devCfg.rpc && devCfg.rpc.innerMode;
  let innerPrefix = devCfg.rpc && devCfg.rpc.innerPrefix;

  switch (innerMode) {
    /**
     * 访问 mock 目录下的模拟接口（如 /mock/[path]/ 等）
     * 使用 js/json 实现 动态/静态 数据模拟
     */
    default:
    case 'mock': {
      innerRpcPath = `${mockPathPrefix}inner/`;
    } break;
    /**
     * 代理访问远程服务器的接口（如 /proxy/[path]/ 等）
     * 此时 proxyTargetDomain 必须含有协议头（如 http:// 等）
     */
    case 'proxy': {
      // 如 https://example.org/path/
      let regExp = /^(((http|https):)?(\/\/([^\/]+)\/))(.*)$/;
      let matchArr = innerPrefix && innerPrefix.match(regExp);

      // 如 ['https://example.org/path/', 'https://example.org/', 'https:', 'https', '//example.org/', 'example.org', 'path/']
      if (matchArr) {
        let protocol = matchArr[2] || (devCfg.https ? 'https:' : 'http:');
        let host = matchArr[5];
        let path = matchArr[6];

        proxyTargetDomain = `${protocol}//${host}/`;
        innerRpcPath = `${proxyPathPrefix}${path}`;
      }
      else {
        innerRpcPath = '/';
      }
    } break;
    /**
     * 直接访问远程服务器的接口（如 //[host]/[path]/ 等）
     * 根据实际情况，远程服务器可能需要支持跨域请求
     */
    case 'remote': {
      innerRpcPath = innerPrefix || '/';
    } break;
  }
})();

// 项目页面路径
const publicPagePath = '/';
// 项目资源路径
const publicAssetPath = `/${defaults.assetUrl}/`;
// 后端接口路径
const publicRpcPath = {
  inner: innerRpcPath
};
// 入口页面对象
const publicPageFullname = defaults.getPublicPageFullname(publicPagePath);

// 获取入口配置
const getEntries = () => {
  let newEntries = {};

  for (let key in base.entry) {
    newEntries[key] = [
      // 'react-hot-loader/patch'
    ].concat(base.entry[key]);
  }

  return newEntries;
};

// 获取插件
const getPlugins = () => {
  let param = defaults.getDefinePluginParam({
    defineEnv: 'dev',
    publicPagePath,
    publicAssetPath,
    publicRpcPath,
    publicPageFullname
  });

  return [].concat(
    base.plugins,
    new webpack.NamedModulesPlugin(),
    new NameAllModulesPlugin(), // 需放置于 NamedModulesPlugin 之后
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(param),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      minimize: false,
      options: {
        context: __dirname
      }
    })
  );
};

// 修改基础配置
const config = base;

config.cache = true;
config.devtool = devCfg.devtool || 'cheap-module-source-map';
config.output.filename = deployCfg.assetNameHash ? '[name].[hash].js' : '[name].js'; // webpack-dev-server 不能使用 [chunkhash]
config.output.chunkFilename = deployCfg.assetNameHash ? '[name].[hash].js' : '[name].js'; // webpack-dev-server 不能使用 [chunkhash]
config.output.pathinfo = true;
config.output.publicPath = publicAssetPath;
config.entry = getEntries();
config.plugins = getPlugins();
config.devServer = devServer({
  port: devCfg.port,
  https: devCfg.https,
  publicPath: publicAssetPath,
  mockPrefix: mockPathPrefix,
  proxyPrefix: proxyPathPrefix,
  proxyTarget: proxyTargetDomain
});

module.exports = config;