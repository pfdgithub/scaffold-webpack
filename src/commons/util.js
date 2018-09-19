// #region URL处理

// 解析URL查询参数
export const parseQueryString = (search) => {
  let query = {};

  if (search) {
    if (search.indexOf('?') === 0) {
      let parameters = search.slice(1).split('&');
      for (let i = 0; i < parameters.length; i++) {
        let p = parameters[i];
        let kv = p.split('=');
        if (kv.length === 2) {
          let k = kv[0];
          let v = kv[1];
          if (k) {
            query[decodeURIComponent(k)] = decodeURIComponent(v);
          }
        }
      }
    }
  }

  return query;
};

// 拼接URL查询参数
export const joinQueryString = (query, noEncode) => {
  if (typeof (query) === 'undefined') {
    return '';
  }

  let search = '?';

  for (let key in query) {
    let value = query[key];
    if (typeof (value) === 'undefined') {
      value = '';
    }
    key = noEncode ? key : encodeURIComponent(key);
    value = noEncode ? value : encodeURIComponent(value);
    search += key + '=' + value + '&';
  }
  if (search[search.length - 1] === '&'
    || search[search.length - 1] === '?') {
    search = search.substring(0, search.length - 1);
  }

  return search;
};

// 解析hash查询参数
export const parseHashString = (hash) => {
  let query = {};

  if (hash) {
    if (hash.indexOf('#') === 0) {
      let parameters = hash.slice(1).split('&');
      for (let i = 0; i < parameters.length; i++) {
        let p = parameters[i];
        let kv = p.split('=');
        if (kv.length === 2) {
          let k = kv[0];
          let v = kv[1];
          if (k) {
            query[k] = decodeURIComponent(v);
          }
        }
      }
    }
  }

  return query;
};

// 拼接hash查询参数
export const joinHashString = (query) => {
  if (typeof (query) === 'undefined') {
    return '';
  }

  let hash = '#';

  for (let key in query) {
    let value = query[key];
    value = encodeURIComponent(value);
    hash += key + '=' + value + '&';
  }
  if (hash[hash.length - 1] === '&'
    || hash[hash.length - 1] === '?') {
    hash = hash.substring(0, hash.length - 1);
  }

  return hash;
};

// 解析URL
export const parseUrl = (url) => {
  let a = document.createElement('a');
  a.href = url;
  return {
    hash: a.hash,
    host: a.host,
    hostname: a.hostname,
    href: a.href,
    origin: a.origin,
    pathname: a.pathname,
    port: a.port,
    protocol: a.protocol,
    search: a.search,

    username: a.username,
    password: a.password,

    params: (() => {
      let ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^/?#]+)$/i) || ['', ''])[1],
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ['', ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
};

// 检查指定URL是否同域
export const isEqOrigin = (url) => {
  let remote = parseUrl(url);
  let local = window.location;

  return remote.origin.toLowerCase() === local.origin.toLowerCase();
};

// #endregion

// #region 格式转换

// UTF-8 转 BASE64
export const utf8ToBase64 = (utf8) => {
  let base64 = window.btoa(window.unescape(window.encodeURIComponent(utf8)));
  return base64;
};

// BASE64 转 UTF-8
export const base64ToUtf8 = (base64) => {
  let utf8 = window.decodeURIComponent(window.escape(window.atob(base64)));
  return utf8;
};

// 安全过滤
export const safetyFilter = (unsafeString) => {
  if (unsafeString) {
    let text = document.createTextNode(unsafeString);
    let div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
  }

  return unsafeString;
};

// 替换br为CRLF
export const brToCrlf = (brString) => {
  let reg = /<\s*br\s*\/?\s*>/ig;

  if (brString) {
    return brString.replace(reg, '\n');
  }

  return brString;
};

// 替换CRLF为br
export const crlfToBr = (crlfString) => {
  let reg = /(\r\n)|(\n)/g;

  if (crlfString) {
    return crlfString.replace(reg, '<br/>');
  }

  return crlfString;
};

// 字符串格式化
export const stringFormat = (...rest) => {
  let format = rest[0];
  let args = rest[1];
  let result = format;
  if (rest.length > 1) {
    if (rest.length === 2 && typeof (args) === 'object') {
      for (let key in args) {
        if (args[key] !== undefined) {
          let reg = new RegExp('({' + key + '})', 'g');
          result = result.replace(reg, args[key]);
        }
      }
    } else {
      for (let i = 1; i < rest.length; i++) {
        if (rest[i] !== undefined) {
          let reg = new RegExp('({)' + (i - 1) + '(})', 'g');
          result = result.replace(reg, rest[i]);
        }
      }
    }
  }
  return result;
};

// 毫秒转换为 yyyy-MM-dd HH:mm:ss
export const msecToString = (timestamp, format) => {
  let ret = '';

  if (timestamp && format) {
    let time = new Date(timestamp);

    let sYear = time.getFullYear().toString().substr(-2); // 短年份
    let sMonth = time.getMonth() + 1; // 短月份
    let sDate = time.getDate(); // 短日期
    let sHour = time.getHours(); // 短小时
    let sMinutes = time.getMinutes(); // 短分钟
    let sSecond = time.getSeconds(); // 短秒
    let sMillisecond = time.getMilliseconds(); // 短毫秒

    let lYear = time.getFullYear(); // 长年份
    let lMonth = sMonth < 10 ? ('0' + sMonth) : sMonth; // 长月份
    let lDate = sDate < 10 ? ('0' + sDate) : sDate; // 长日期
    let lHour = sHour < 10 ? ('0' + sHour) : sHour; // 长小时
    let lMinutes = sMinutes < 10 ? ('0' + sMinutes) : sMinutes; // 长分钟
    let lSecond = sSecond < 10 ? ('0' + sSecond) : sSecond; // 长秒
    let lMillisecond = sMillisecond < 10 ? ('0' + sMillisecond) : sMillisecond; // 长毫秒
    let llMillisecond = sMillisecond < 10 ? ('00' + sMillisecond) : (sMillisecond < 100 ? ('0' + sMillisecond) : sMillisecond); // 长长毫秒

    ret = format;

    ret = ret.replace(/yyyy/g, lYear); // 长年份
    ret = ret.replace(/yy/g, sYear); // 短年份

    ret = ret.replace(/MM/g, lMonth); // 长月份
    ret = ret.replace(/M/g, sMonth); // 短月份

    ret = ret.replace(/dd/g, lDate); // 长日期
    ret = ret.replace(/d/g, sDate); // 短日期

    ret = ret.replace(/HH/g, lHour); // 长小时
    ret = ret.replace(/H/g, sHour); // 短小时

    ret = ret.replace(/mm/g, lMinutes); // 长分钟
    ret = ret.replace(/m/g, sMinutes); // 短分钟

    ret = ret.replace(/ss/g, lSecond); // 长秒
    ret = ret.replace(/s/g, sSecond); // 短秒

    ret = ret.replace(/fff/g, llMillisecond); // 长长毫秒
    ret = ret.replace(/ff/g, lMillisecond); // 长毫秒
    ret = ret.replace(/f/g, sMillisecond); // 短毫秒
  }

  return ret;
};

// yyyy-MM-dd HH:mm:ss 转换为Date
export const stringToDate = (dateString) => {
  let ret = undefined;

  let r = '([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})( ([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2}))?)?';
  if (dateString) {
    let d = dateString.match(new RegExp(r));
    if (d) {
      ret = new Date(d[1] - 0, d[2] - 1, d[3] - 0);
      if (d[5]) {
        ret.setHours(d[5] - 0);
      }
      if (d[6]) {
        ret.setMinutes(d[6] - 0);
      }
      if (d[8]) {
        ret.setSeconds(d[8] - 0);
      }
    }
  }

  return ret;
};

/**
 * 日期进位 bit 可选为 yyyy MM dd HH mm ss
 * 如：bit 为 dd 可将 2017-01-01 00:00:00.000 转换为 2017-01-01 23:59:59.999
 */
export const dateCarryBit = (timestamp, bit) => {
  let newTimestamp = timestamp;

  if (timestamp && bit) {
    let date = new Date(timestamp);

    if (bit === 'yyyy') {
      date.setFullYear(date.getFullYear() + 1);
    }
    else if (bit === 'MM') {
      date.setMonth(date.getMonth() + 1);
    }
    else if (bit === 'dd') {
      date.setDate(date.getDate() + 1);
    }
    else if (bit === 'HH') {
      date.setHours(date.getHours() + 1);
    }
    else if (bit === 'mm') {
      date.setMinutes(date.getMinutes() + 1);
    }
    else if (bit === 'ss') {
      date.setSeconds(date.getSeconds() + 1);
    }

    if (date.getTime() !== parseInt(timestamp)) {
      date.setMilliseconds(date.getMilliseconds() - 1);
      newTimestamp = date.getTime();
    }
  }

  return newTimestamp;
};

// 千分位分割数字
export const thousandSeparator = (number, len) => {
  let strNum = "";
  let decLen = 0;

  if (typeof (len) === "number" && len > 0) {
    decLen = len;
  }

  if (typeof (number) === "number") {
    strNum = number.toFixed(decLen);
  }
  else if (typeof (number) !== "undefined") {
    strNum = number.toString();
  }

  if (strNum) {
    let match = strNum.match(/^(-)?(\d+)(\.\d+)?$/);
    if (match) {
      let symbol = match[1] ? match[1] : '';
      let integer = match[2] ? match[2] : '';
      let fraction = match[3] ? match[3] : '.';

      if (integer.length > 3) {
        let source = integer.split('');
        let target = [];

        for (let i = 0; i < source.length; i++) {
          let index = (source.length - 1) - i;
          let item = source[index];

          target.push(item);
          if (((i + 1) % 3) === 0 && i !== (source.length - 1)) {
            target.push(',');
          }
        }

        integer = target.reverse().join('');
      }

      for (let i = 0; i < decLen; i++) {
        fraction = fraction + "0";
      }
      fraction = fraction.substring(0, (decLen === 0 ? decLen : (decLen + 1)));

      return symbol + integer + fraction;
    }
  }

  return number;
};

// 过滤字符串中特殊字符，避免破坏JSON结构。
export const stringJsonFilter = (source, hideCode) => {
  /*
   * 参考资料：
   * http://blog.codemonkey.cn/archives/437
   */
  // let toString = Object.prototype.toString;
  // let isArray = Array.isArray || (a)=> {
  //   return toString.call(a) === '[object Array]';
  // };
  let escMap = {
    '"': '\\"',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t'
  };
  let escFunc = (m) => {
    let value = escMap[m];
    if (value) {
      //后台可正常处理这些字符，故而不再处理。
      //return value;
      return m;
    } else if (hideCode) {
      return ' '; //用空格占位
    } else {
      return '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substring(1);
    }
  };
  /* eslint-disable */
  let escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
  /* eslint-enable */

  //只处理字符串类型
  if (typeof (source) !== 'string') {
    return source;
  } else {
    let target = source.replace(escRE, escFunc);
    return target;
  }
};

// 人类友好日期
export const humanFriendlyDate = (timestamp) => {
  let ret = timestamp;

  if (typeof (timestamp) === 'number') {
    let diff = Math.floor((Date.now() - timestamp) / 1000); // 秒
    if (diff >= (12 * 30 * 24 * 60 * 60)) {
      ret = Math.floor(diff / (12 * 30 * 24 * 60 * 60)) + '年前';
    }
    else if (diff >= (30 * 24 * 60 * 60)) {
      ret = Math.floor(diff / (30 * 24 * 60 * 60)) + '个月前';
    }
    else if (diff >= (24 * 60 * 60)) {
      ret = Math.floor(diff / (24 * 60 * 60)) + '天前';
    }
    else if (diff >= (60 * 60)) {
      ret = Math.floor(diff / (60 * 60)) + '小时前';
    }
    else if (diff >= (60)) {
      ret = Math.floor(diff / (60)) + '分钟前';
    }
    else {
      ret = '刚刚';
    }
  }

  return ret;
};

// 人类友好数字
export const humanFriendlyNumber = (num) => {
  let ret = num;

  if (typeof (num) === 'number') {
    if (num >= (100 * 1000 * 1000 * 1000)) {
      ret = Math.floor(num / (100 * 1000 * 1000 * 1000)) + '千亿';
    }
    else if (num >= (10 * 1000 * 1000 * 1000)) {
      ret = Math.floor(num / (10 * 1000 * 1000 * 1000)) + '百亿';
    }
    // else if (num >= (1000 * 1000 * 1000)) {
    //   ret = Math.floor(num / (1000 * 1000 * 1000)) + '十亿';
    // }
    else if (num >= (100 * 1000 * 1000)) {
      ret = Math.floor(num / (100 * 1000 * 1000)) + '亿';
    }
    else if (num >= (10 * 1000 * 1000)) {
      ret = Math.floor(num / (10 * 1000 * 1000)) + '千万';
    }
    else if (num >= (1000 * 1000)) {
      ret = Math.floor(num / (1000 * 1000)) + '百万';
    }
    // else if (num >= (100 * 1000)) {
    //   ret = Math.floor(num / (100 * 1000)) + '十万';
    // }
    else if (num >= (10 * 1000)) {
      ret = Math.floor(num / (10 * 1000)) + '万';
    }
    else if (num >= (1000)) {
      ret = Math.floor(num / (1000)) + '千';
    }
    else if (num >= (100)) {
      ret = Math.floor(num / (100)) + '百';
    }
    // else if (num >= (10)) {
    //   ret = Math.floor(num / (10)) + '十';
    // }
    else {
      ret = num;
    }
  }

  return ret;
};

// #endregion

// #region 类型检查

// 是否是对象
export const isObject = (what) => {
  return typeof what === 'object' && what !== null;
};

// 是否是错误
export const isError = (value) => {
  switch (Object.prototype.toString.call(value)) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return value instanceof Error;
  }
};

// 是否是 undefined
export const isUndefined = (what) => {
  return what === void 0;
};

// 是否是函数
export const isFunction = (what) => {
  return typeof what === 'function';
};

// 是否是简单对象
export const isPlainObject = (what) => {
  return Object.prototype.toString.call(what) === '[object Object]';
};

// 是否是字符串
export const isString = (what) => {
  return Object.prototype.toString.call(what) === '[object String]';
};

// 是否是数组
export const isArray = (what) => {
  return Object.prototype.toString.call(what) === '[object Array]';
};

// 是否是空对象
export const isEmptyObject = (what) => {
  if (!isPlainObject(what)) return false;

  for (let _ in what) {
    if (what.hasOwnProperty(_)) {
      return false;
    }
  }
  return true;
};

// #endregion

// #region 业务检查

// 检验身份证号码
export const isIDNo = (cid) => {
  let arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  if (/^\d{17}(\d|x)$/i.test(cid)) {
    let sum = 0,
      idx;
    for (let i = 0; i < cid.length - 1; i++) {
      sum += parseInt(cid.substr(i, 1), 10) * arrExp[i];
    }
    idx = sum % 11;
    return (arrValid[idx].toString() === cid.substr(17, 1).toUpperCase());
  } else if (/^\d{15}$/.test(cid)) {
    let year = cid.substring(6, 8);
    let month = cid.substring(8, 10);
    let day = cid.substring(10, 12);
    let temp_date = new Date(year, parseInt(month) - 1, parseInt(day));
    return (temp_date.getFullYear() === (parseInt(year) + 1900) &&
      temp_date.getMonth() === (parseInt(month) - 1) && temp_date.getDate() === parseInt(day));
  } else {
    return false;
  }
};

// 检验手机号
export const isMobile = (mobile) => {
  let reg = /^1\d{10}$/;
  return reg.test(mobile);
};

// 检验邮箱
export const isEmail = (email) => {
  let reg = /^[.\w-]+@[\w-]+(\.[\w-]+)+$/;
  return reg.test(email);
};

// 检验银行卡号
export const isBankCard = (cardId) => {
  let reg = /^\d{16,}$/;
  return reg.test(cardId);
};

// 掩盖身份证号码
export const maskIDNo = (cid) => {
  if (cid && cid.length === 18) {
    return cid.slice(0, 6) + '********' + cid.slice(14);
  }

  return cid;
};

// 掩盖手机号码
export const maskMobile = (mobile) => {
  if (mobile && mobile.length === 11) {
    return mobile.slice(0, 3) + '****' + mobile.slice(7);
  }

  return mobile;
};

// #endregion

// #region 枚举定义

/**
 * 从简单对象定义枚举，支持正向映射和反向映射。如：
 * {
 *    A: 1,
 *    B: 2
 * }
 */
export const defEnumWithObject = (object = {}) => {
  let Enum = {};

  for (let key in object) {
    let val = object[key];
    Enum[key] = val;
    Enum[val] = key;
  }

  return Enum;
};

/**
 * 从二维数组定义枚举，支持正向映射和反向映射。如：
 * [
 *    ['A', 1, '枚举项描述1'],
 *    ['B', 2, '枚举项描述2']
 * ]
 */
export const defEnumWith2DArray = (array = []) => {
  let Enum = {};
  Enum._text = {};

  for (let i = 0; i < array.length; i++) {
    let arr = array[i];
    if (arr && arr.length >= 2) {
      let key = arr[0];
      let val = arr[1];
      let text = arr[2];

      Enum[key] = val;
      Enum[val] = key;
      Enum._text[key] = text;
      Enum._text[val] = text;
    }
  }

  return Enum;
};

// #endregion

// #region 节流防抖

// 节流 当调用动作触发一段时间后，才会执行该动作，若在这段时间间隔内又调用此动作则将重新计算时间间隔
export const debounce = (idle, action) => {
  let last = 0;
  return (...rest) => {
    clearTimeout(last);
    last = setTimeout(() => {
      action(...rest);
    }, idle);
  };
};

// 防抖 预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新的时间周期
export const throttle = (delay, action) => {
  let last = 0;
  return (...rest) => {
    let curr = Date.now();
    if (curr - last >= delay) {
      last = curr;
      action(...rest);
    }
  };
};

// #endregion

// #region 环境检查

// 是否支持 Web Storage
export const supportStorage = () => {
  if (window.sessionStorage) {
    try {
      let item = 'wd-sessionStorage-test';
      window.sessionStorage.setItem(item, item);
      window.sessionStorage.removeItem(item);
      return true;
    } catch (e) {
      return false;
    }
  }
  else {
    return false;
  }
};

// 待对比版本是否大于（等于）基础版本
export const gtVer = (baseVer, compareVer, eq = true) => {
  if ((baseVer && baseVer.length > 0) && (compareVer && compareVer.length > 0)) {
    let maxLength = baseVer.length > compareVer.length ? baseVer.length : compareVer.length;

    for (let i = 0; i < maxLength; i++) {
      let base = baseVer[i];
      let compare = compareVer[i];

      if (compare > base) {
        return true;
      }
      else if (compare < base) {
        return false;
      }
      else {
        // 检测最后一位是否相等
        if ((i + 1) === maxLength) {
          return eq;
        }
      }
    }
  }

  return false;
};

// 是否为 Windows
export const isWindows = () => {
  return !!window.navigator.userAgent.match(/Windows/i);
};

// 是否为 Mac
export const isMac = () => {
  return !!window.navigator.userAgent.match(/Macintosh/i);
};

// 是否为 Android
export const isAndroid = () => {
  return !!window.navigator.userAgent.match(/Android/i);
};

// 是否为 IOS
export const isIOS = () => {
  return !!window.navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i);
};

// 是否为 Android WebView
export const isAndroidWebView = () => {
  // https://developer.chrome.com/multidevice/user-agent
  let userAgent = window.navigator.userAgent;
  let android = userAgent.match(/Android/i);
  let wv = userAgent.match(/wv/i);

  return android && wv;
};

// 是否为 IOS WebView
export const isIOSWebView = () => {
  // https://stackoverflow.com/questions/4460205/detect-ipad-iphone-webview-via-javascript
  let standalone = window.navigator.standalone;
  let userAgent = window.navigator.userAgent;
  let ios = userAgent.match(/(iPhone)|(iPad)|(iPod)/i);
  let safari = userAgent.match(/Safari/i);

  return ios && !safari && !standalone;
};

// IOS 设备
export const iosDevice = () => {
  let match = window.navigator.userAgent.match(/Mobile\/(\w+)/i);
  if (match) {
    return match[1] || '';
  }

  return null;
};

// Windows 版本
export const windowsVer = () => {
  let match = window.navigator.userAgent.match(/Windows NT (\d+)(\.(\d+))?(\.(\d+))?/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// Mac 版本
export const macVer = () => {
  let match = window.navigator.userAgent.match(/Mac OS X (\d+)(_(\d+))?(_(\d+))?/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// Android 版本
export const androidVer = () => {
  let match = window.navigator.userAgent.match(/Android (\d+)(\.(\d+))?(\.(\d+))?/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// IOS 版本
export const iosVer = () => {
  let match = window.navigator.userAgent.match(/OS (\d+)(_(\d+))?(_(\d+))? like Mac OS X/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// Chrome 版本
export const chromeVer = () => {
  let match = window.navigator.userAgent.match(/Chrome\/(\d+)(\.(\d+))?(\.(\d+))?/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// Firefox 版本
export const firefoxVer = () => {
  let match = window.navigator.userAgent.match(/Firefox\/(\d+)(\.(\d+))?(\.(\d+))?/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// IE 版本
export const ieVer = () => {
  let match = window.navigator.userAgent.match(/MSIE (\d+)(\.(\d+))?(\.(\d+))?/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  let match2 = window.navigator.userAgent.match(/rv:(\d+)(\.(\d+))?(\.(\d+))?/i);
  if (match2) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// Edge 版本
export const edgeVer = () => {
  let match = window.navigator.userAgent.match(/Edge\/(\d+)(\.(\d+))?(\.(\d+))?/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// Safari 技术版本
export const safariTechVer = () => {
  let match = window.navigator.userAgent.match(/Safari\/(\d+)(\.(\d+))?(\.(\d+))?/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// Safari 用户版本
export const safariUserVer = () => {
  let match = window.navigator.userAgent.match(/Version\/(\d+)(\.(\d+))?(\.(\d+))?/i);
  if (match) {
    return [
      parseInt(match[1] ? match[1] : 0),
      parseInt(match[3] ? match[3] : 0),
      parseInt(match[5] ? match[5] : 0)
    ];
  }

  return null;
};

// #endregion

// #region 其它

// 加载页面
export const gotoPage = (url, query, hash) => {
  let href = url + joinQueryString(query) + joinHashString(hash);
  window.location.href = href;
};

// 返回页面
export const backPage = () => {
  window.history.back();
};

// 生成 UUID
export const uuid4 = () => {
  let crypto = window.crypto || window.msCrypto;

  if (!isUndefined(crypto) && crypto.getRandomValues) {
    // Use window.crypto API if available
    let arr = new Uint16Array(8);
    crypto.getRandomValues(arr);

    // set 4 in byte 7
    arr[3] = (arr[3] & 0xfff) | 0x4000;
    // set 2 most significant bits of byte 9 to '10'
    arr[4] = (arr[4] & 0x3fff) | 0x8000;

    let pad = (num) => {
      let v = num.toString(16);
      while (v.length < 4) {
        v = '0' + v;
      }
      return v;
    };

    return (
      pad(arr[0]) +
      pad(arr[1]) +
      pad(arr[2]) +
      pad(arr[3]) +
      pad(arr[4]) +
      pad(arr[5]) +
      pad(arr[6]) +
      pad(arr[7])
    );
  } else {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
};

// 深度递归 Object.assign
export const deepAssign = (target, ...sources) => {
  let to = Object(target);

  // 遍历来源对象数组
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    // 检查是否为简单对象
    if (Object.prototype.toString.call(source) !== '[object Object]') {
      to = Object.assign(to, source);
      continue;
    }

    // 遍历来源对象
    for (let key in source) {
      // 是否为自身属性
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        let val = source[key];
        // 检查是否为简单对象
        if (Object.prototype.toString.call(val) !== '[object Object]') {
          to[key] = val;
          continue;
        }

        // 递归调用
        to[key] = deepAssign(to[key], val);
      }
    }
  }

  return to;
};

// #endregion
