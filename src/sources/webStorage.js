import nattyStorage from 'natty-storage';

const def = {
  key: 'wd', // 缓存对象存储数据所使用的唯一标识。
  tag: 'v1.0' // 缓存的标记，用于判断是否有效。
};

export const local = (options) => {
  return nattyStorage(Object.assign({
    type: 'localStorage',
    duration: 1000 * 60 * 60 * 24 // 缓存的有效期长，以毫秒数指定。
  }, def, options));
};

export const session = (options) => {
  return nattyStorage(Object.assign({
    type: 'sessionStorage'
  }, def, options));
};

export const variable = (options) => {
  return nattyStorage(Object.assign({
    type: 'variable'
  }, def, options));
};