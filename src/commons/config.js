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
/* eslint-enable */

// 调试模式
const isDebug = defineEnv === 'dev' || defineEnv === 'test';
// 模拟数据
const isMock = defineEnv === 'dev';

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
    isDebug: isDebug,
    isMock: isMock
  }
};