# 入口脚本目录

入口脚本目录。其目录的命名和数量，必须与入口页面文件的命名和数量保持一致。  
入口脚本应继承自同一个基类，并以 index.js 作为入口文件。  

xxx.yyy/images/ 目录放置只在该页面使用的图片。  
xxx.yyy/styles/ 目录放置只在该页面使用的样式。  

# 注意事项

将通过 css-loader 的 [CSS Modules](https://github.com/webpack/css-loader#css-modules) 模式，为类名添加特定前缀，建议类名使用小驼峰方式，便于引用。  
如果必须在组件中覆盖全局样式，请使用 [:local 和 :global](https://github.com/webpack/css-loader#local-scope) 标识切换。  
