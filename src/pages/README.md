# 入口页面目录

pages.js 使用 CommonJS 模块规范，导出一个对象。  
用该对象作为配置，使用模版文件，生成多个入口页面。  
```javascript
{
  entries: [
    {
      name: 'index', // 入口名称
      title: '首页', // 页面标题
      template: 'template.html' // 模版文件
    }
  ]
}
```

# 注意事项

