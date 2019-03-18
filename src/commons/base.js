// 载入公共样式
import 'normalize.css/normalize.css';
import 'styles/base.less';

// 载入公共脚本

// // 载入日志上报
// import './report';

if (__define_enable_pwa__) { /* eslint-disable-line */
  // 载入简单 SW 示例
  require('sources/sw.simple');
}
