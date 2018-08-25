# Redux 目录

单页应用可使用 Redux 管理数据，多页应用就没必要了。  
单视图独享数据维护在自己的 state 中，多视图共享的数据维护在 Redux 中。  

xxx/actions.js 基于业务划分的 action  
xxx/reducers.js 基于业务划分的 reducer  
actions.js 导出所有 action  
reducers.js 合并所有的 reducer  
store.js 创建唯一的 store  

# 注意事项
