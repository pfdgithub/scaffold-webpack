# 业务组件目录

组件按照交互逻辑划分，可在任何页面中引入。  
以较小颗粒度划分的功能块，每个组件一个目录，使用大驼峰方式命名。  
组件应继承自同一个基类，并以 index.js 作为入口文件。  

XxxYyy/images/ 目录放置组件所需图片。  
XxxYyy/styles/ 目录放置组件所需样式。  

# 注意事项

将通过 css-loader 的 [CSS Modules](https://github.com/webpack/css-loader#css-modules) 模式，为类名添加特定前缀，建议类名使用小驼峰方式，便于引用。  
如果必须在组件中覆盖全局样式，请使用 [:local 和 :global](https://github.com/webpack/css-loader#local-scope) 标识切换。  

组件需要维护自己内部的结构，组件之间不能预期其他组件存在特定结构。  
每个组件需接受外部的 className 属性，追加在自己的类名之后。  
