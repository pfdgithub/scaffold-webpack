import logo from 'images/logo.png';

/* eslint-disable */
// 定义环境类型
const env = __define_env__;
// 定义项目版本
const ver = __define_ver__;
// 项目页面路径
const publicPagePath = __define_public_page_path__;
// 项目资源路径
const publicAssetPath = __define_public_asset_path__;
// 后端接口路径
const publicRpcPath = __define_public_rpc_path__;
// 项目页面名称
const publicPageFullname = __define_public_page_fullname__;
// 启用 pwa
const enablePwa = __define_enable_pwa__;
// 启用 web push
const enablePush = __define_enable_push__;
// service worker 名称
const swName = __define_sw_name__;
/* eslint-enable */

// 环境枚举
const envEnum = {
  dev: 'dev',
  test: 'test',
  prod: 'prod'
};

// 调试模式
const isDebug = env === envEnum.dev || env === envEnum.test;
// 模拟数据
const isMock = env === envEnum.dev;
// 启用日志上报
const enabledRaven = env === envEnum.test || env === envEnum.prod;
// 禁用信息级别日志
const disableInfo = env === envEnum.prod;

// 默认配置
export default {
  public: { // 部署相关
    pagePath: publicPagePath,
    assetPath: publicAssetPath,
    rpcPath: publicRpcPath,
    pageFullname: publicPageFullname
  },
  state: { // 状态相关
    env: env,
    ver: ver,
    isDebug: isDebug,
    isMock: isMock
  },
  sw: { // service worker 相关
    enablePwa: enablePwa,
    enablePush: enablePush,
    swName: swName,
    noticeIcon: logo
  },
  raven: { // Raven 日志上报配置
    enabledRaven: enabledRaven,
    disableInfo: disableInfo,
    dsn: ''
  }
};