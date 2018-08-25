import nattyStorage from 'natty-storage';

const def = {
  key: 'wd', // 缓存对象存储数据所使用的唯一标识。
  tag: 'v1.0' // 缓存的标记，用于判断是否有效。
};

const local = nattyStorage(Object.assign({}, def, {
  type: 'localStorage',
  duration: 1000 * 60 * 60 * 24 // 缓存的有效期长，以毫秒数指定
}));

const session = nattyStorage(Object.assign({}, def, {
  type: 'sessionStorage'
}));

const variable = nattyStorage(Object.assign({}, def, {
  type: 'variable'
}));

export {
  local,
  session,
  variable
};