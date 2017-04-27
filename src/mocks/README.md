# 模拟数据目录

本地模拟接口数据，请按照后端系统和接口层级，划分目录结构。  
支持使用 js/json 文件，动态/静态生成模拟数据。  

# 注意事项

优先调用同级的 js 文件，没有则调用 json 文件，仍没有则调用 global.js 文件。  
其中 js 文件使用 CommonJS 模块规范，导出一个函数，接收两个参数：  
req 参数 [Request](http://expressjs.com/en/4x/api.html#req)  
res 参数 [Response](http://expressjs.com/en/4x/api.html#res)  

模拟 REST 风格接口数据，需在 rest.js 或 rest.json 文件中配置接口路径。  
请求路径中携带的参数，保存在 res.locals.restParam 中。  