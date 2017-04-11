let path = require('path');
let glob = require('glob');

let pkg = require('../package.json');

let name = pkg.name; // 项目名称
let version = pkg.version; // 项目版本
let description = pkg.description; // 项目描述
let timestamp = Date.now(); // 时间戳

let port = 8000; // 调试端口
let https = false; // 使用 https 协议
let pageSuffix = '.html'; // 入口页面后缀名
let assetDir = 'assets'; // 资产文件夹
let assetFilename = '[name]'; // 资源文件名

let srcPath = path.join(__dirname, '../src'); // 源文件路径
let distPath = path.join(__dirname, '../dist'); // 构建文件路径
let commonPath = path.join(srcPath, 'commons'); // 公共资源路径
let componentPath = path.join(srcPath, 'components'); // 业务组件路径
let entryPath = path.join(srcPath, 'entries'); // 入口脚本路径
let imagePath = path.join(srcPath, 'images'); // 公共图片路径
let libraryPath = path.join(srcPath, 'libraries'); // 第三方库路径
let mockPath = path.join(srcPath, 'mocks'); // 模拟数据路径
let pagePath = path.join(srcPath, 'pages'); // 入口页面路径
let sourcePath = path.join(srcPath, 'sources'); // 数据源路径
let stylePath = path.join(srcPath, 'styles'); // 公共样式路径
let viewPath = path.join(srcPath, 'views'); // 单页视图路径

let entryPages = (() => { // 入口页面列表
  let pageList = [];
  let pattern = path.join(pagePath, '*' + pageSuffix);

  glob.sync(pattern).forEach((fullFileName) => {
    let name = path.parse(fullFileName).name;
    pageList.push(name);
  });

  return pageList;
})();

// 获取入口页面对象
let getPublicPageFullname = (publicPagePath) => { // 项目页面全名
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
        else{
          temp = temp[separator] = {};
        }
      }
    });
  });
  return pageObj;
};

// 获取 DefinePlugin 插件参数
let getDefinePluginParam = (param) => {
  return {
    '__wd_define_env__': JSON.stringify(param.defineEnv),
    '__wd_define_debug__': JSON.stringify(param.defineDebug),
    '__wd_public_page_path__': JSON.stringify(param.publicPagePath),
    '__wd_public_page_fullname__': JSON.stringify(param.publicPageFullname),
    '__wd_public_asset_path__': JSON.stringify(param.publicAssetPath),
    '__wd_public_rpc_path__': JSON.stringify(param.publicRpcPath)
  };
};

module.exports = {
  name,
  version,
  description,
  timestamp,

  port,
  https,
  pageSuffix,
  assetDir,
  assetFilename,

  srcPath,
  distPath,
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

  entryPages,
  getPublicPageFullname,
  getDefinePluginParam
};