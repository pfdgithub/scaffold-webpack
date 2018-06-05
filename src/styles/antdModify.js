/**
 * 覆盖 Ant Design 的默认 Less 变量，并本地化 iconfont 资源。
 * https://github.com/ant-design/antd-init/tree/master/examples/customize-antd-theme
 * https://github.com/ant-design/antd-init/tree/master/examples/local-iconfont
 */

let libName = 'antd';
let resolve = require.resolve(libName);
let antdPath = resolve.substring(0, resolve.lastIndexOf(libName) + libName.length);

let lessVars = {
  '@icon-url': '"~styles/anticon/iconfont"'
};

module.exports = {
  antdPath,
  lessVars
};
