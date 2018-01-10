const path = require('path');
const glob = require('glob');

const pkg = require('../package.json');

const pageSuffix = '.html'; // 入口页面后缀名
const assetDir = 'assets'; // 资产文件夹

const name = pkg.name; // 项目名称
const version = pkg.version; // 项目版本
const description = pkg.description; // 项目描述
const scaffoldConfig = pkg.scaffoldConfig; // 脚手架配置

// 输入路径
const srcPath = path.join(__dirname, '../src'); // 源文件路径
const commonPath = path.join(srcPath, 'commons'); // 公共资源路径
const componentPath = path.join(srcPath, 'components'); // 业务组件路径
const entryPath = path.join(srcPath, 'entries'); // 入口脚本路径
const imagePath = path.join(srcPath, 'images'); // 公共图片路径
const libraryPath = path.join(srcPath, 'libraries'); // 第三方库路径
const mockPath = path.join(srcPath, 'mocks'); // 模拟数据路径
const pagePath = path.join(srcPath, 'pages'); // 入口页面路径
const sourcePath = path.join(srcPath, 'sources'); // 数据源路径
const stylePath = path.join(srcPath, 'styles'); // 公共样式路径
const viewPath = path.join(srcPath, 'views'); // 单页视图路径

// 输出路径
const distPath = path.join(__dirname, '../dist'); // 构建文件路径
const deployConfig = (scaffoldConfig && scaffoldConfig.deploy) || {};
const portalPath = deployConfig.portalMultiVersion ?
  path.join(distPath, version) : path.join(distPath); // 项目页面路径
const assetPath = deployConfig.assetMultiVersion ?
  path.join(distPath, version, assetDir) : path.join(distPath, assetDir); // 项目资源路径
const assetUrl = deployConfig.assetMultiVersion ?
  `${version}/${assetDir}` : `${assetDir}`; // 项目资源 URL

const entryPages = (() => { // 入口页面列表
  let pageList = [];
  let pattern = path.join(pagePath, '*' + pageSuffix);

  glob.sync(pattern).forEach((fullFileName) => {
    let name = path.parse(fullFileName).name;
    pageList.push(name);
  });

  return pageList;
})();

// 获取入口页面对象
const getPublicPageFullname = (publicPagePath) => { // 项目页面全名
  let pageObj = {};
  entryPages.forEach((entryPage) => {
    let separators = entryPage.split('.');
    let temp = pageObj;
    separators.forEach((separator, index, array) => {
      if (index == array.length - 1) {
        temp[separator] = publicPagePath + entryPage + pageSuffix;
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
    '__wd_public_page_fullname__': JSON.stringify(param.publicPageFullname)
  };
};

module.exports = {
  pageSuffix,
  assetDir,

  name,
  version,
  description,
  scaffoldConfig,

  srcPath,
  commonPath,
  componentPath,
  entryPath,
  imagePath,
  libraryPath,
  mockPath,
  pagePath,
  sourcePath,
  stylePath,
  viewPath,

  distPath,
  portalPath,
  assetPath,
  assetUrl,

  entryPages,
  getPublicPageFullname,
  getDefinePluginParam
};