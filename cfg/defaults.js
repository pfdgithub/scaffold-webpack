let path = require('path');
let glob = require('glob');
let HtmlWebpackPlugin = require('html-webpack-plugin');

let pkg = require('../package.json');

let version = pkg.version; // 项目版本
let port = 8000; // 调试端口
let https = false; // 使用 https 协议
let pageSuffix = '.html'; // 入口页面后缀名
let assetDir = 'assets'; // 资产文件夹
let assetFilename = '[name]'; // 资源文件名

let srcPath = path.join(__dirname, '../src'); // 源文件路径
let distPath = path.join(__dirname, '../dist'); // 构建文件路径
let pagePath = path.join(srcPath, 'pages'); // 入口页面路径
let entryPath = path.join(srcPath, 'entries'); // 入口脚本路径
let componentPath = path.join(srcPath, 'components'); // 业务组件路径
let viewPath = path.join(srcPath, 'views'); // 单页视图路径
let mockPath = path.join(srcPath, 'mocks'); // 模拟数据路径
let verDistPath = path.join(distPath, version); // 当前版本的构建文件路径

let extractBundle = { // 提取公共依赖（注意：由于 webpack 的实现机制，被引用最多的 bundle 中会包含初始化代码。）
  commonBundle: [
    'commons/base', 'commons/util', 'commons/device', 'commons/config',
    'sources/db.global', 'sources/db.inner'
  ],
  reactBundle: ['react', 'react-dom']
};
let entryPages = (() => { // 入口页面列表
  let pageList = [];
  let pattern = path.join(pagePath, '*' + pageSuffix);

  glob.sync(pattern).forEach(function (fullFileName) {
    let name = path.parse(fullFileName).name;
    pageList.push(name);
  });

  return pageList;
})();

// 获取入口页面对象
let getPublicPageFullname = (publicPagePath) => { // 项目页面全名
  let pageObj = {};
  entryPages.forEach(function (entryPage) {
    let separators = entryPage.split('.');
    let temp = pageObj;
    separators.forEach(function (separator, index, array) {
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
// 获取 html-webpack-plugin 插件配置
let getHtmlWebpackPlugins = (outputPath) =>{
  let plugins = [];

  // 获取 html-webpack-plugin 插件配置
  entryPages.forEach(function (entryPage) {
    plugins.push(new HtmlWebpackPlugin({
      template: path.join(pagePath, entryPage + pageSuffix),
      filename: path.join(outputPath, entryPage + pageSuffix), // 输出至指定目录
      chunks: [].concat(Object.keys(extractBundle), entryPage),
      chunksSortMode: 'dependency',
      hash: true,
      inject: true,
      alwaysWriteToDisk: true, // 将内存文件写入磁盘
      alterAssetTags: function (htmlPluginData) { // 为插入的标签添加 crossorigin 属性，允许跨域脚本提供详细错误信息。
        let assetTags = [].concat(htmlPluginData.head).concat(htmlPluginData.body);
        assetTags.forEach(function (assetTag) {
          if (assetTag.tagName == 'script' || assetTag.tagName == 'link') {
            assetTag.attributes.crossorigin = 'anonymous';
          }
        });
        return htmlPluginData;
      }
    }));
  });

  return plugins;
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
  version: version,
  port: port,
  https: https,
  pageSuffix: pageSuffix,
  assetDir: assetDir,
  assetFilename: assetFilename,

  srcPath: srcPath,
  distPath: distPath,
  pagePath: pagePath,
  entryPath: entryPath,
  componentPath: componentPath,
  viewPath: viewPath,
  mockPath: mockPath,
  verDistPath: verDistPath,

  extractBundle: extractBundle,
  entryPages: entryPages,

  getPublicPageFullname: getPublicPageFullname,
  getHtmlWebpackPlugins: getHtmlWebpackPlugins,
  getDefinePluginParam: getDefinePluginParam
};