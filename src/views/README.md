# 功能视图目录

视图按照业务逻辑划分，可在任何页面中引入。  
以较大颗粒度划分的功能块，每个视图一个目录，使用大驼峰方式命名。  
视图应继承自同一个基类，并以 index.js 作为入口文件。  

XxxYyy/images/ 目录放置视图所需图片。  
XxxYyy/styles/ 目录放置视图所需样式。  

# 注意事项

将通过 css-loader 的 [CSS Modules](https://github.com/webpack/css-loader#css-modules) 模式，为类名添加特定前缀，建议类名使用小驼峰方式，便于引用。  
如果必须在组件中覆盖全局样式，请使用 [:local 和 :global](https://github.com/webpack/css-loader#local-scope) 标识切换。  

视图需要维护自己内部的结构，视图之间不能预期其他视图存在特定结构。  
视图对外应该是一个黑盒子，只暴露输入和输出，屏蔽内部细节。  
