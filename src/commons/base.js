// 载入公共样式
import 'normalize.css/normalize.css';
import 'styles/base.less';

// 载入公共脚本
import 'core-js/fn/promise'; // webpack natty-fetch
// import 'core-js/fn/map'; // react 16
// import 'core-js/fn/set'; // react 16
// import 'raf/polyfill'; // react 16

// 载入 service worker
import sw from 'sources/sw.boot';
sw.example();