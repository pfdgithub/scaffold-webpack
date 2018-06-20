# 源文件目录

commons/ 公共资源目录。  
components/ 业务组件目录。  
entries/ 入口脚本目录。  
images/ 公共图片目录。  
libraries/ 第三方库目录。  
pages/ 入口页面目录。  
sources/ 数据源目录。  
states/ Redux 目录。  
styles/ 公共样式目录。  
views/ 功能视图目录。  

# 目录说明

commons 目录中存放与业务无关的辅助工具和项目配置。  
components 中存放以较小颗粒度划分的功能块， views 目录存放以较大颗粒度划分的功能块。  
entries 目录中子目录的命名和数量，必须与 pages 目录中文件的命名和数量保持一致。  
images styles 目录存放整个项目公用的资源文件。  
libraries 目录存放未托管在 npm 中的第三方库。  
sources 目录配置项目的数据来源，接口路径结构包装等。  
components entries views 目录，将使用 css-loader 的 CSS Modules 模式处理样式文件。  

# 注意事项

为避免导航混乱，多页以及单页的返回操作，均使用浏览器的后退机制。  
多页之间的跳转，暂时直接跳转后期异步加载。单页之间的跳转，使用路由处理。  
项目外的页面，尽量在新窗口打开。项目内的页面，尽量在当前页打开。  
多页以及单页之间的数据传递，无论 Location 或 Storage 均存在被篡改或易丢失隐患，需谨慎使用。  
