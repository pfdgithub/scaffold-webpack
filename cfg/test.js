let webpack = require('webpack');
let AssetsWebpackPlugin = require('assets-webpack-plugin');

let defaults = require('./defaults');
let base = require('./base');

// 项目页面路径
let publicPagePath = '//scaffold.wdai.com/';
// 入口页面对象
let publicPageFullname = defaults.getPublicPageFullname(publicPagePath);
// 项目资源路径
let publicAssetPath = `https://static.wdai.com/static/fed/group/project/${defaults.version}/${defaults.assetDir}/`;
// 后端接口路径
let publicRpcPath = {
  inner: '//scaffold.wdai.com/'
};

// 获取加载器
let getModules = () => {
  let newLoaders = [].concat(
    base.module.loaders,
    {
      test: /\.(js|jsx)$/,
      loader: 'es3ify-loader!babel-loader?cacheDirectory',
      include: defaults.srcPath
    }
  );

  return Object.assign({}, base.module, {
    loaders: newLoaders
  });
};

// 获取插件
let getPlugins = () => {
  let param = defaults.getDefinePluginParam({
    defineEnv: 'test',
    defineDebug: true,
    publicPagePath,
    publicPageFullname,
    publicAssetPath,
    publicRpcPath
  });
  param['process.env.NODE_ENV'] = JSON.stringify('production');

  return [].concat(
    base.plugins,
    defaults.getHtmlWebpackPlugins(defaults.verDistPath),
    // new webpack.optimize.DedupePlugin(), // 谨慎使用重复数据删除插件
    new webpack.DefinePlugin(param),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   // mangle: {
    //   //   except: ['React', 'ReactDOM']
    //   // },
    //   comments: false,
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new AssetsWebpackPlugin({
      path: defaults.verDistPath,
      filename: 'assets.json',
      prettyPrint: true,
      fullPath: true,
      metadata: {
        version: defaults.version,
        timestamp: (new Date()).getTime()
      }
    })
  );
};

// 扩展基础配置
let config = Object.assign({}, base, {
  debug: false,
  cache: false,
  devtool: 'source-map'
});

// config.output.pathinfo = false;
config.output.publicPath = publicAssetPath;
config.devServer.publicPath = publicAssetPath;
config.module = getModules();
config.plugins = getPlugins();

module.exports = config;