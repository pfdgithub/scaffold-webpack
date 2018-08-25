const webpack = require('webpack');
const HashAllModulesPlugin = require('hash-all-modules-plugin');

const util = require('./util');
const paths = require('./paths');
const base = require('./base');
const devServer = require('./devServer');
const pkg = require('../package.json');

const defineEnv = util.envEnum.prod; // 环境类型
const pkgCfg = util.getPkgCfg(pkg, defineEnv); // 项目配置
const envCfg = pkgCfg.envCfg; // 环境配置
const deployCfg = pkgCfg.deployCfg; // 部署配置

// 本地路径配置
const pathsCfg = paths(pkg, deployCfg);

// 远程 url 配置
const publishCfg = {
  // 项目页面路径
  publicPagePath: envCfg.pagePrefix || '/',
  // 项目资源路径
  publicAssetPath: `${envCfg.assetPrefix || '/'}${pathsCfg.assetUrlPart}/`,
  // 后端接口路径
  publicRpcPath: Object.assign({
    inner: '/' // 配置一个默认项
  }, envCfg.rpcPrefix)
};

// 开发服务器配置
const devServerCfg = devServer(envCfg, pathsCfg, publishCfg);

// 基础配置
const baseCfg = base(deployCfg, pathsCfg, publishCfg);

// 扩展配置
const extendCfg = {
  mode: 'production',
  devtool: 'hidden-source-map',
  devServer: devServerCfg,
  optimization: {
    minimize: true
  },
  output: {
    pathinfo: false,
    filename: deployCfg.assetNameHash ? 'js/[name].[chunkhash].js' : 'js/[name].js',
    chunkFilename: deployCfg.assetNameHash ? 'js/[name].[chunkhash].js' : 'js/[name].js'
  },
  plugins: [
    new webpack.NamedChunksPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new HashAllModulesPlugin(), // 需放置于 HashedModuleIdsPlugin 之后
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true,
      options: {
        context: __dirname
      }
    })
  ]
};

module.exports = util.deepAssign({}, baseCfg, extendCfg, {
  plugins: [].concat(baseCfg.plugins, extendCfg.plugins)
});
