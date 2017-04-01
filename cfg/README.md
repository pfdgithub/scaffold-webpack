# webpack 配置文件目录

cert/ https 自签名证书。  
devServer.js 开发服务器配置。  
defaults.js 与环境无关的配置。  
base.js 基础环境配置。  
dev.js 开发环境配置。  
test.js 测试环境配置。  
prod.js 生产环境配置。  

# 部署配置

通过读取 /package.json 文件中 version 属性值，在构建目录中创建相应的子目录。实现非覆盖式发布，允许多版本共存。  

由于使用 extract-text-webpack-plugin 造成 webpack 的运行时配置部署路径功能不可用，因此只能在构建代码时配置部署路径。与部署相关的配置项：  
1. publicPagePath 为项目页面路径（即 html 入口页面）。  
2. publicAssetPath 为项目资源路径（即 js css 静态文件）。  
3. publicRpcPath 为后端接口路径（即 json 接口前缀）。  

默认情况下，入口页面与静态文件一起放置于静态资源服务器。如果希望满足以下要求，需要将入口页面放置于后端服务器：  
1. 需要后端控制入口页面的访问权限（如未登录跳转至登录页）。  
2. 不方便处理跨域异步请求（如第三方 cookie 的隐私策略）。  
3. 期望向用户展示特定域名，而非静态资源服务器的域名。  

# 接口模拟

开发过程中，要与后端约定接口路径和入参出参结构，首先在本地模拟接口数据，然后与后端联调业务流程。提供以下方案：  
1. 访问 /mocks 目录下的 js/json 模拟接口，可动态/静态生成模拟数据。  
2. 代理访问远程服务器的接口，可测试后端完整流程，且不存在跨域问题。  
3. 直接访问远程服务器的接口，可测试后端完整流程，但需要后端提供跨域支持。  

# 注意事项

启用 extract-text-webpack-plugin 后，将无法使用 Hot Module Replacement 和 runtime public path modification 特性。  
通过 css-loader 的 [CSS Modules](https://github.com/webpack/css-loader#css-modules) 模式，模块化指定目录下的样式文件。  
通过 less 的 [Modify Variables](http://lesscss.org/usage/#using-less-in-the-browser-modify-variables) 模式，覆盖外部样式的默认 Less 变量。  
