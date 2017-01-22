# 公共样式目录

base.less 基础样式。  
util.less 辅助功能。  

# 注意事项

尽可能在使用外部组件的地方，就近覆盖样式。对于覆盖频率很高的组件，可在独立的 less 文件中定义 Mixins 代码。  
在组件调用处使用 [Namespaces](http://lesscss.org/features/#mixins-feature-namespaces) 方式引用。  
