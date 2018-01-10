const webpack = require('webpack');
const HashAllModulesPlugin = require('hash-all-modules-plugin');

const devServer = require('./devServer');
const defaults = require('./defaults');
const base = require('./base');

// 脚手架配置
const cfg = (() => {
  let config = (defaults.scaffoldConfig && defaults.scaffoldConfig.test) || {};
  return {
    pagePrefix: config.pagePrefix,
    assetPrefix: config.assetPrefix,
    innerPrefix: config.rpcPrefix && config.rpcPrefix.inner
  };
})();

// 项目页面路径
const publicPagePath = cfg.pagePrefix || '/';
// 项目资源路径
const publicAssetPath = `${cfg.assetPrefix || '/'}${defaults.assetUrl}/`;
// 后端接口路径
const publicRpcPath = {
  inner: cfg.innerPrefix || '/'
};
// 入口页面名称对象
const publicPageFullname = defaults.getPublicPageFullname(publicPagePath);

// 获取插件
const getPlugins = () => {
  let param = defaults.getDefinePluginParam({
    defineEnv: 'test',
    publicPagePath,
    publicAssetPath,
    publicRpcPath,
    publicPageFullname
  });
  param['process.env.NODE_ENV'] = JSON.stringify('production');

  return [].concat(
    base.plugins,
    new webpack.HashedModuleIdsPlugin(),
    new HashAllModulesPlugin(), // 需放置于 HashedModuleIdsPlugin 之后
    new webpack.optimize.AggressiveMergingPlugin(),
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

config.cache = false;
config.devtool = 'source-map';
config.output.filename = '[name]-[chunkhash].js';
config.output.chunkFilename = '[name]-[chunkhash].js';
config.output.pathinfo = true;
config.output.publicPath = publicAssetPath;
config.plugins = getPlugins();
config.devServer = devServer({
  publicPath: publicAssetPath
});

module.exports = config;