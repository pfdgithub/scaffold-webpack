const path = require('path');
const webpack = require('webpack');
const HashAllModulesPlugin = require('hash-all-modules-plugin');
/**
 * 2018-01-04
 * 临时方案：并行混淆代码
 * uglifyjs-webpack-plugin 的 1.x 版本已经内置了并行支持。
 * webpack.optimize.UglifyJsPlugin 目前使用 0.4.6 版本。
 * webpack 4.x 将内置 uglifyjs-webpack-plugin 1.x 版本。
 */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const devServer = require('./devServer');
const defaults = require('./defaults');
const base = require('./base');

// 脚手架配置
const scaffoldCfg = (defaults.scaffoldConfig && defaults.scaffoldConfig.prod) || {};
const _pagePrefix = scaffoldCfg.pagePrefix;
const _assetPrefix = scaffoldCfg.assetPrefix;
const _innerPrefix = scaffoldCfg.rpcPrefix && scaffoldCfg.rpcPrefix.inner;

// 项目页面路径
const publicPagePath = _pagePrefix || '/';
// 项目资源路径
const publicAssetPath = `${_assetPrefix || '/'}${defaults.version}/${defaults.assetDir}/`;
// 后端接口路径
const publicRpcPath = {
  inner: _innerPrefix || '/'
};
// 入口页面名称对象
const publicPageFullname = defaults.getPublicPageFullname(publicPagePath);

// 获取插件
const getPlugins = () => {
  let param = defaults.getDefinePluginParam({
    defineEnv: 'prod',
    defineVer: defaults.version,
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
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: `/${defaults.name}/`
        }
      }
    }),
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

config.cache = false;
config.devtool = 'hidden-source-map';
config.output.filename = '[name]-[chunkhash].js';
config.output.chunkFilename = '[name]-[chunkhash].js';
config.output.pathinfo = false;
config.output.publicPath = publicAssetPath;
config.plugins = getPlugins();
config.devServer = devServer({
  publicPath: publicAssetPath
});

module.exports = config;