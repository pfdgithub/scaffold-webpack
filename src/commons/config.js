/* eslint-disable */
// 定义环境类型
let defineEnv = __wd_define_env__;
// 定义项目版本
let defineVer = __wd_define_ver__;
// 项目页面路径
let publicPagePath = __wd_public_page_path__;
// 项目资源路径
let publicAssetPath = __wd_public_asset_path__;
// 后端接口路径
let publicRpcPath = __wd_public_rpc_path__;
// 项目页面名称
let publicPageFullname = __wd_public_page_fullname__;
/* eslint-enable */

// 调试模式
let isDebug = defineEnv == 'dev' || defineEnv == 'test';
// 模拟数据
let isMock = defineEnv == 'dev';

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