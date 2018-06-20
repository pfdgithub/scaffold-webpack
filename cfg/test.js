const webpack = require('webpack');
const HashAllModulesPlugin = require('hash-all-modules-plugin');

const devServer = require('./devServer');
const defaults = require('./defaults');
const base = require('./base');
const deployCfg = defaults.deployCfg || {};
const testCfg = (defaults.scaffoldCfg && defaults.scaffoldCfg.test) || {};

// 项目页面路径
const publicPagePath = testCfg.pagePrefix || '/';
// 项目资源路径
const publicAssetPath = `${testCfg.assetPrefix || '/'}${defaults.assetUrl}/`;
// 后端接口路径
const publicRpcPath = {
  inner: (testCfg.rpcPrefix && testCfg.rpcPrefix.inner) || '/'
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
    new webpack.NamedChunksPlugin(),
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

config.mode = 'production';
config.devtool = 'source-map';
config.output.filename = deployCfg.assetNameHash ? 'js/[name].[chunkhash].js' : 'js/[name].js';
config.output.chunkFilename = deployCfg.assetNameHash ? 'js/[name].[chunkhash].js' : 'js/[name].js';
config.output.pathinfo = true;
config.output.publicPath = publicAssetPath;
config.optimization.minimize = false;
config.plugins = getPlugins();
config.devServer = devServer();

module.exports = config;