const path = require('path');

const pkg = require('../package.json');

const pageSuffix = '.html'; // 入口页面后缀名
const assetDir = 'assets'; // 资产文件夹
const swName = 'service-worker.js'; // service worker 名称

const name = pkg.name; // 项目名称
const version = pkg.version; // 项目版本
const description = pkg.description; // 项目描述
const scaffoldCfg = pkg.scaffold; // 脚手架配置

// 模拟数据路径
const mockPath = path.join(__dirname, '../mock');

// 输入路径
const srcPath = path.join(__dirname, '../src'); // 源文件路径
const commonPath = path.join(srcPath, 'commons'); // 公共资源路径
const componentPath = path.join(srcPath, 'components'); // 业务组件路径
const entryPath = path.join(srcPath, 'entries'); // 入口脚本路径
const imagePath = path.join(srcPath, 'images'); // 公共图片路径
const libraryPath = path.join(srcPath, 'libraries'); // 第三方库路径
const pagePath = path.join(srcPath, 'pages'); // 入口页面路径
const sourcePath = path.join(srcPath, 'sources'); // 数据源路径
const statesPath = path.join(srcPath, 'states'); // 状态集路径
const stylePath = path.join(srcPath, 'styles'); // 公共样式路径
const viewPath = path.join(srcPath, 'views'); // 单页视图路径

// 输出路径
const deployCfg = (scaffoldCfg && scaffoldCfg.deploy) || {};
const distPath = path.join(__dirname, '../dist'); // 构建文件路径
const portalPath = deployCfg.portalMultiVersion ?
  path.join(distPath, version) : path.join(distPath); // 项目页面路径
const assetPath = deployCfg.assetMultiVersion ?
  path.join(distPath, version, assetDir) : path.join(distPath, assetDir); // 项目资源路径
const assetUrl = deployCfg.assetMultiVersion ?
  `${version}/${assetDir}` : `${assetDir}`; // 项目资源 URL

const antdModify = require(path.join(srcPath, 'styles', 'antdModify')); // 覆盖 antd-mobile 的变量

const entryPages = (() => { // 入口页面列表
  let pages = require(path.join(pagePath, 'pages.js'));

  return pages.entries || [];
})();

// 获取入口页面对象
const getPublicPageFullname = (publicPagePath) => { // 项目页面全名
  let pageObj = {};
  entryPages.forEach((entryPage) => {
    let separators = entryPage.name.split('.');
    let temp = pageObj;
    separators.forEach((separator, index, array) => {
      if (index === array.length - 1) {
        temp[separator] = publicPagePath + entryPage.name + pageSuffix;
      }
      else {
        if (separator in temp) {
          temp = temp[separator];
        }
        else {
          temp = temp[separator] = {};
        }
      }
    });
  });
  return pageObj;
};

// 获取 DefinePlugin 插件参数
const getDefinePluginParam = (param) => {
  return {
    '__wd_define_ver__': JSON.stringify(version),
    '__wd_define_env__': JSON.stringify(param.defineEnv),
    '__wd_public_page_path__': JSON.stringify(param.publicPagePath),
    '__wd_public_asset_path__': JSON.stringify(param.publicAssetPath),
    '__wd_public_rpc_path__': JSON.stringify(param.publicRpcPath),
    '__wd_public_page_fullname__': JSON.stringify(param.publicPageFullname),
    '__wd_service_worker_name__': JSON.stringify(deployCfg.enablePwa ? swName : ''),
    '__wd_enable_web_push__': !!deployCfg.enablePush
  };
};

module.exports = {
  pageSuffix,
  assetDir,
  swName,

  name,
  version,
  description,
  scaffoldCfg,

  mockPath,

  srcPath,
  commonPath,
  componentPath,
  entryPath,
  imagePath,
  libraryPath,
  pagePath,
  sourcePath,
  statesPath,
  stylePath,
  viewPath,

  deployCfg,
  distPath,
  portalPath,
  assetPath,
  assetUrl,

  antdModify,
  entryPages,
  getPublicPageFullname,
  getDefinePluginParam
};