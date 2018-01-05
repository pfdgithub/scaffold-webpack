let util = {};

// 解析URL查询参数
util.parseQueryString = (search) => {
  let query = {};
  search = search ? search : window.location.search;

  if (search.indexOf('?') === 0) {
    let parameters = search.slice(1).split('&');
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

  return query;
};

// 拼接URL查询参数
util.joinQueryString = (query) => {
  if (typeof (query) === 'undefined'
    || JSON.stringify(query) === '{}') {
    return '';
  }

  let search = '?';

  for (let key in query) {
    let value = query[key];
    if (typeof (value) === 'undefined') {
      value = '';
    }
    value = encodeURIComponent(value);
    search += key + '=' + value + '&';
  }
  if (search[search.length - 1] === '&'
    || search[search.length - 1] === '?') {
    search = search.substring(0, search.length - 1);
  }

  return search;
};

// 解析hash查询参数
util.parseHashString = (hash) => {
  let query = {};
  hash = hash ? hash : window.location.hash;

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

  return query;
};

// 拼接hash查询参数
util.joinHashString = (query) => {
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
util.parseUrl = (url) => {
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

    params: (function () {
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
util.isEqOrigin = (url) => {
  let remote = util.parseUrl(url);
  let local = window.location;

  return remote.origin.toLowerCase() === local.origin.toLowerCase();
};

// 安全过滤
util.safetyFilter = (unsafeString) => {
  if (unsafeString) {
    let text = document.createTextNode(unsafeString);
    let div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
  }

  return unsafeString;
};

// 替换br为CRLF
util.brToCrlf = (brString) => {
  let reg = /<\s*br\s*\/?\s*>/ig;

  if (brString) {
    return brString.replace(reg, '\n');
  }

  return brString;
};

// 替换CRLF为br
util.crlfToBr = (crlfString) => {
  let reg = /(\r\n)|(\n)/g;

  if (crlfString) {
    return crlfString.replace(reg, '<br/>');
  }

  return crlfString;
};

// 检验身份证号码
util.isIDNo = (cid) => {
  let arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  if (/^\d{17}\d|x$/i.test(cid)) {
    let sum = 0,
      idx;
    for (let i = 0; i < cid.length - 1; i++) {
      sum += parseInt(cid.substr(i, 1), 10) * arrExp[i];
    }
    idx = sum % 11;
    return (arrValid[idx] === cid.substr(17, 1).toUpperCase());
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
util.isMobile = (mobile) => {
  let reg = /^1\d{10}$/;
  return reg.test(mobile);
};

// 检验邮箱
util.isEmail = (email) => {
  let reg = /^[.\w-]+@[\w-]+(\.[\w-]+)+$/;
  return reg.test(email);
};

// 检验银行卡号
util.isBankCard = (cardId) => {
  let reg = /^\d{16,}$/;
  return reg.test(cardId);
};

// 掩盖手机号码
util.maskMobile = (mobile) => {
  if (mobile && mobile.length === 11) {
    return mobile.slice(0, 3) + '****' + mobile.slice(7);
  }

  return mobile;
};

// 字符串格式化
util.stringFormat = (...rest) => {
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
util.msecToString = (timestamp, format) => {
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
util.stringToDate = (dateString) => {
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

// 日期进位 bit 可选为 yyyy MM dd HH mm ss
// 如：bit 为 dd 可将 2017-01-01 00:00:00.000 转换为 2017-01-01 23:59:59.999
util.dateCarryBit = (timestamp, bit) => {
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
util.thousandSeparator = (number, len) => {
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
      let fraction = match[3] ? match[3] : '';

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
util.stringJsonFilter = (source, hideCode) => {
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
  let escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;

  //只处理字符串类型
  if (typeof (source) !== 'string') {
    return source;
  } else {
    let target = source.replace(escRE, escFunc);
    return target;
  }
};

// UTF-8 转 BASE64
util.utf8ToBase64 = (utf8) => {
  let base64 = window.btoa(window.unescape(window.encodeURIComponent(utf8)));
  return base64;
};

// BASE64 转 UTF-8
util.base64ToUtf8 = (base64) => {
  let utf8 = window.decodeURIComponent(window.escape(window.atob(base64)));
  return utf8;
};

// 节流 当调用动作触发一段时间后，才会执行该动作，若在这段时间间隔内又调用此动作则将重新计算时间间隔
util.debounce = (idle, action) => {
  let last = 0;
  return (...rest) => {
    clearTimeout(last);
    last = setTimeout(() => {
      action(...rest);
    }, idle);
  };
};

// 防抖 预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新的时间周期
util.throttle = (delay, action) => {
  let last = 0;
  return (...rest) => {
    let curr = Date.now();
    if (curr - last >= delay) {
      last = curr;
      action(...rest);
    }
  };
};

// 是否支持 Web Storage
util.supportStorage = () => {
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

// 加载页面
util.gotoPage = (url, query, hash) => {
  let href = url + util.joinQueryString(query) + util.joinHashString(hash);
  window.location.href = href;
};

// 返回页面
util.backPage = () => {
  window.history.back();
};

// 人类友好日期
util.humanFriendlyDate = (timestamp) => {
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
util.humanFriendlyNumber = (num) => {
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

export default util;