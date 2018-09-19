/**
 * 覆盖 Ant Design Mobile 的默认 Less 变量，并本地化 iconfont 资源。
 * https://github.com/ant-design/antd-init/tree/master/examples/customize-antd-theme
 * https://github.com/ant-design/antd-init/tree/master/examples/local-iconfont
 */

let libName = 'antd-mobile';
let resolve = require.resolve(libName);
let antdPath = resolve.substring(0, resolve.lastIndexOf(libName) + libName.length);

let lessVars = {
  '@hd': '2px',
  '@fill-body': '#FFFFFF'
};

module.exports = {
  antdPath,
  lessVars
};
