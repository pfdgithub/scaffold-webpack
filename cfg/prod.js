const webpack = require('webpack');
const HashAllModulesPlugin = require('hash-all-modules-plugin');

const devServer = require('./devServer');
const defaults = require('./defaults');
const base = require('./base');
const deployCfg = defaults.deployCfg || {};
const prodCfg = (defaults.scaffoldCfg && defaults.scaffoldCfg.prod) || {};

// 项目页面路径
const publicPagePath = prodCfg.pagePrefix || '/';
// 项目资源路径
const publicAssetPath = `${prodCfg.assetPrefix || '/'}${defaults.assetUrl}/`;
// 后端接口路径
const publicRpcPath = {
  inner: (prodCfg.rpcPrefix && prodCfg.rpcPrefix.inner) || '/'
};
// 入口页面名称对象
const publicPageFullname = defaults.getPublicPageFullname(publicPagePath);

// 获取插件
const getPlugins = () => {
  let param = defaults.getDefinePluginParam({
    defineEnv: 'prod',
    publicPagePath,
    publicAssetPath,
    publicRpcPath,
    publicPageFullname
  });
  param['process.env.NODE_ENV'] = JSON.stringify('production');

  return [].concat(
    base.plugins,
    new webpack.NamedChunksPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new HashAllModulesPlugin(), // 需放置于 HashedModuleIdsPlugin 之后
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin(param),
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true,
      options: {
        context: __dirname
      }
    })
  );
};

// 修改基础配置
const config = base;

config.mode = 'production';
config.devtool = 'hidden-source-map';
config.output.filename = deployCfg.assetNameHash ? 'js/[name].[chunkhash].js' : 'js/[name].js';
config.output.chunkFilename = deployCfg.assetNameHash ? 'js/[name].[chunkhash].js' : 'js/[name].js';
config.output.pathinfo = false;
config.output.publicPath = publicAssetPath;
config.optimization.minimize = true;
config.plugins = getPlugins();
config.devServer = devServer();

module.exports = config;