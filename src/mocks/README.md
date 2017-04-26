# 模拟数据目录

本地模拟接口数据，请按照后端系统和接口层级，划分目录结构。  
支持使用 js/json 文件，动态/静态生成模拟数据。  

# 注意事项

优先调用同级的 js 文件，没有则调用 json 文件，仍没有则调用 global.js 文件。  
使用 REST 风格接口数据，需在 rest.js 文件中配置。可在 res.locals.restParam 中获取路径中的参数。  
其中 js 文件使用 CommonJS 模块规范，导出一个函数。函数返回一个 json 对象，接收两个参数：  
req 参数 [Request](http://expressjs.com/en/4x/api.html#req)  
res 参数 [Response](http://expressjs.com/en/4x/api.html#res)  
