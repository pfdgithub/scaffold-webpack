const webpack = require('webpack');

const util = require('./util');
const paths = require('./paths');
const base = require('./base');
const devServer = require('./devServer');
const pkg = require('../package.json');

const defineEnv = util.envEnum.dev; // 环境类型
const pkgCfg = util.getPkgCfg(pkg, defineEnv); // 项目配置
const envCfg = pkgCfg.envCfg; // 环境配置
const deployCfg = pkgCfg.deployCfg; // 部署配置

// 本地路径配置
const pathsCfg = paths(pkg, deployCfg);

// 远程 url 配置
const publishCfg = {
  // 项目页面路径
  publicPagePath: '/',
  // 项目资源路径
  publicAssetPath: '/' + (pathsCfg.assetUrlPart ? `${pathsCfg.assetUrlPart}/` : ''),
  // 后端接口路径
  publicRpcPath: Object.assign({
    inner: '/' // 配置一个默认项
  }, envCfg.rpcPrefix)
};

// 代理服务器配置
const proxyCfg = (() => {
  // 模拟数据路径前缀
  const mockPathPrefix = '/mock/';
  // 本地代理路径前缀
  const proxyPathPrefix = '/proxy/';
  // 本地代理路径前缀数组
  const proxyPathPrefixs = [];
  // 代理目标域名数组（如 [protocol]//[host]/ 等）
  const proxyTargetDomains = [];
  // 多后端接口支持
  for (let key in publishCfg.publicRpcPath) {
    let prefix = publishCfg.publicRpcPath[key];
    let rpcPage = '';

    switch (envCfg.rpcMode) {
      /**
       * 访问 mock 目录下的模拟接口（如 /mock/inner/[path]/ 等）
       * 使用 js/json 实现 动态/静态 数据模拟
       */
      default:
      case 'mock': {
        rpcPage = `${mockPathPrefix}${key}/`;
      } break;
      /**
       * 代理访问远程服务器的接口（如 /proxy/inner/[path]/ 等）
       * 此时 proxyTargetDomain 必须含有协议头（如 http:// 等）
       */
      case 'proxy': {
        // 如 https://example.org/path/
        let regExp = /^(((http|https):)?(\/\/([^/]+)\/))(.*)$/;
        let matchArr = prefix && prefix.match(regExp);

        // 如 ['https://example.org/path/', 'https://example.org/', 'https:', 'https', '//example.org/', 'example.org', 'path/']
        if (matchArr) {
          let protocol = matchArr[2] || (envCfg.https ? 'https:' : 'http:');
          let host = matchArr[5];
          let path = matchArr[6];

          rpcPage = `${proxyPathPrefix}${key}/${path}`;

          proxyPathPrefixs.push(`${proxyPathPrefix}${key}/`);
          proxyTargetDomains.push(`${protocol}//${host}/`);
        }
        else {
          rpcPage = '/';
        }
      } break;
      /**
       * 直接访问远程服务器的接口（如 //[host]/[path]/ 等）
       * 根据实际情况，远程服务器可能需要支持跨域请求
       */
      case 'remote': {
        rpcPage = prefix || '/';
      } break;
    }

    publishCfg.publicRpcPath[key] = rpcPage;
  }

  return {
    mockPathPrefix,
    proxyPathPrefix,
    proxyPathPrefixs,
    proxyTargetDomains
  };
})();

// 开发服务器配置
const devServerCfg = devServer(envCfg, pathsCfg, publishCfg, proxyCfg);

// 基础配置
const baseCfg = base(deployCfg, pathsCfg, publishCfg);

// 扩展配置
const extendCfg = {
  mode: 'development',
  devtool: envCfg.devtool || 'eval',
  devServer: devServerCfg,
  optimization: {
    minimize: false
  },
  output: {
    pathinfo: true,
    filename: deployCfg.assetNameHash ? 'js/[name].[hash].js' : 'js/[name].js', // webpack-dev-server 不能使用 [chunkhash]
    chunkFilename: deployCfg.assetNameHash ? 'js/[name].[hash].js' : 'js/[name].js' // webpack-dev-server 不能使用 [chunkhash]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      minimize: false,
      options: {
        context: __dirname
      }
    })
  ]
};

module.exports = util.deepAssign({}, baseCfg, extendCfg, {
  plugins: [].concat(baseCfg.plugins, extendCfg.plugins)
});
