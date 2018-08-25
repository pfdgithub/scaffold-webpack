# 公共资源目录

ReactBase.jsx 全项目的 React 基类。  
device.js 基于 userAgent 检测环境，修改自[device.js](https://github.com/matthewhudson/device.js)。  
base.js 基础资源，初始化页面环境，必须在每一个入口脚本中引入。  
config.js 项目配置文件，接收 webpack 传入的参数。  
report.js 向 Sentry 服务端上报错误追踪。  
util.js 辅助函数定义。  

# 注意事项

使用 babel-plugin-transform-runtime 配合 babel-runtime 为“内置函数”、“静态方法”提供垫片。  
使用 core-js 为“内置函数”、“静态方法”、“实例方法”提供垫片，根据需要手工维护。  