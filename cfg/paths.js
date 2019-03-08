const path = require('path');

module.exports = (pkg, deployCfg) => {
  const pageSuffix = '.html'; // 入口页面后缀名
  const swName = 'service-worker.js'; // service worker 名称

  const name = pkg.name; // 项目名称
  const version = pkg.version; // 项目版本
  const description = pkg.description; // 项目描述

  const mockPath = path.join(__dirname, '../mock'); // 模拟数据路径

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
  const distPath = path.join(__dirname, '../dist'); // 构建文件路径
  const portalPath = deployCfg.portalMultiVersion ?
    path.join(distPath, version) : path.join(distPath); // 项目页面路径
  const assetPath = deployCfg.assetMultiVersion ?
    path.join(distPath, version) : path.join(distPath); // 项目资源路径
  const assetUrlPart = deployCfg.assetMultiVersion ?
    `${version}` : ``; // 项目资源 URL 片段

  const antdModify = require(path.join(srcPath, 'styles', 'antdModify')); // 覆盖 antd 的变量

  // 入口页面列表
  const entryPages = (() => {
    let pages = require(path.join(pagePath, 'pages.js'));

    return pages.entries || [];
  })();

  return {
    pageSuffix,
    swName,

    name,
    version,
    description,

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

    distPath,
    portalPath,
    assetPath,
    assetUrlPart,

    antdModify,
    entryPages
  };
};