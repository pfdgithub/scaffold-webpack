// 载入公共样式
// import 'normalize.css/normalize.css';
import 'antd-mobile/es/style'; // antd-mobile 中内置 normalize.css
import 'styles/base.less';

// 载入公共脚本
import promise from 'core-js/library/fn/promise'; // webpack natty-fetch
window.Promise || (window.Promise = promise);
import map from 'core-js/library/fn/map'; // react 16
window.Map || (window.Map = map);
import set from 'core-js/library/fn/set'; // react 16
window.Set || (window.Set = set);
import raf from 'raf'; // react 16
window.requestAnimationFrame || (raf.polyfill());

// // 载入简单 SW 示例
// import 'sources/sw.simple';

// // 载入日志上报
// import './report';