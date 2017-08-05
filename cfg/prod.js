let webpack = require('webpack');

let devServer = require('./devServer');
let defaults = require('./defaults');
let base = require('./base');

// 项目页面路径
let publicPagePath = '//[domain]/[path]/';
// 项目资源路径
let publicAssetPath = `//[domain]/[path]/${defaults.version}/${defaults.assetDir}/`;
// 后端接口路径
let publicRpcPath = {
  inner: '//[domain]/[path]/'
};
// 入口页面名称对象
let publicPageFullname = defaults.getPublicPageFullname(publicPagePath);

// 获取插件
let getPlugins = () => {
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
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin(param),
    new webpack.optimize.UglifyJsPlugin({
      comments: new RegExp(defaults.name),
      sourceMap: true
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
let config = base;

config.cache = false;
config.devtool = 'source-map';
config.output.pathinfo = false;
config.output.publicPath = publicAssetPath;
config.plugins = getPlugins();
config.devServer = devServer({
  publicPath: publicAssetPath
});

module.exports = config;