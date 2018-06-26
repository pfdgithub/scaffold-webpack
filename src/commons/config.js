import logo from 'images/logo.png';

/* eslint-disable */
// 定义环境类型
const defineEnv = __wd_define_env__;
// 定义项目版本
const defineVer = __wd_define_ver__;
// 项目页面路径
const publicPagePath = __wd_public_page_path__;
// 项目资源路径
const publicAssetPath = __wd_public_asset_path__;
// 后端接口路径
const publicRpcPath = __wd_public_rpc_path__;
// 项目页面名称
const publicPageFullname = __wd_public_page_fullname__;
// service worker 名称
const serviceWorkerName = __wd_service_worker_name__;
// 启用 web push
const enableWebPush = __wd_enable_web_push__;
/* eslint-enable */

// 环境枚举
let envEnum = {
  dev: 'dev',
  test: 'test',
  prod: 'prod'
};

// 调试模式
const isDebug = defineEnv === envEnum.dev || defineEnv === envEnum.test;
// 模拟数据
const isMock = defineEnv === envEnum.dev;

// 默认配置
export default {
  public: { // 部署相关
    defineEnv: defineEnv,
    pagePath: publicPagePath,
    assetPath: publicAssetPath,
    rpcPath: publicRpcPath,
    pageFullname: publicPageFullname
  },
  state: { // 状态相关
    env: defineEnv,
    ver: defineVer,
    isDebug: isDebug,
    isMock: isMock
  },
  sw: { // service worker 相关
    swName: serviceWorkerName,
    enablePush: enableWebPush,
    noticeIcon: logo
  }
};