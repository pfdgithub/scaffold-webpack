import { addLocaleData } from 'react-intl';
import intl_zh from 'react-intl/locale-data/zh';
import intl_en from 'react-intl/locale-data/en';
import * as cookie from '../cookie';
import locale_zh from './zh.json';
import locale_en from './en.json';

const key = 'locale';
const defaultLocale = 'zh';
const defaultMessages = locale_zh;

// 获取区域
export const getLocale = () => {
  // 从 localStorage 中获取
  let storage_val = localStorage && localStorage.getItem(key);
  if (storage_val) {
    return storage_val;
  }

  // 从 cookie 中获取
  let cookie_val = cookie.getItem(key);
  if (cookie_val) {
    return cookie_val;
  }

  // 从 navigator 中获取
  let navigator_val = navigator.language || navigator.browserLanguage;
  if (navigator_val) {
    return navigator_val;
  }

  // 默认中文
  return defaultLocale;
};

// 设置区域
export const setLocale = (locale = defaultLocale) => {
  if (localStorage) {
    // 往 localStorage 中设置
    localStorage.setItem(key, locale);
  }
  else {
    // 往 cookie 中设置
    cookie.setItem(key, locale);
  }
};

// 初始化
export const initIntl = () => {
  // 配置 react-intl
  addLocaleData([...intl_zh, ...intl_en]);

  // 当前语言
  let locale = getLocale();
  let parentLocale = locale.split('-')[0];

  // 当前区域
  let messages = defaultMessages;
  if (parentLocale === 'en') {
    messages = locale_en;
  }

  return {
    locale,
    parentLocale,
    messages
  };
};
