let fs = require('fs');
let path = require('path');
let bodyParser = require('body-parser');
let multer = require('multer');
let cookieParser = require('cookie-parser');
let webpack = require('webpack');

let defaults = require('./defaults');
let base = require('./base');

// 项目页面路径
let publicPagePath = '/';
// 入口页面对象
let publicPageFullname = defaults.getPublicPageFullname(publicPagePath);
// 项目资源路径
let publicAssetPath = `/${defaults.version}/${defaults.assetDir}/`;
// 后端接口路径
let publicRpcPath = {
  inner: '/mocks/inner/' // 访问 mocks 目录下 js/json 模拟接口
  // inner: '/proxy/' // 代理访问远程服务器的接口
  // inner: '//127.0.0.1:8000/' // 直接访问远程服务器的接口
};

// webpack-dev-server 插件的 proxy 配置
let devServerProxy = {
  '/proxy/': {
    target: '//127.0.0.1:8000/',
    pathRewrite: {
      '^/proxy/': '/'
    },
    logLevel: 'debug', // 修改 webpack-dev-server 的日志等级
    secure: false, // 忽略检查代理目标的 SSL 证书
    changeOrigin: true, // 修改代理目标请求头中的 host 为目标源
    onProxyReq: (proxyReq, req/*, res*/) => { // 代理目标请求发出前触发
      /**
       * 当代理 POST 请求时 http-proxy-middleware 与 body-parser 有冲突。
       * [Modify Post Parameters](https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/modify-post.md)
       * [Edit proxy request/response POST parameters](https://github.com/chimurai/http-proxy-middleware/issues/61)
       * [socket hang up error with nodejs](http://stackoverflow.com/questions/25207333/socket-hang-up-error-with-nodejs)
       */
      let body = req.body;
      let method = req.method.toLowerCase();

      if (body && method == 'post') {
        let contentType = req.get('Content-Type');
        contentType = contentType ? contentType.toLowerCase() : '';

        if (contentType.includes('application/json')) {
          // 使用 application/json 类型提交表单
          let bodyData = JSON.stringify(body);

          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
        else if (contentType.includes('application/x-www-form-urlencoded')) {
          // 使用 application/x-www-form-urlencoded 类型提交表单
          let bodyData = Object.keys(body).map((key) => {
            let val = body[key];
            val = val ? val : '';
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
          }).join('&');

          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
        else if (contentType.includes('multipart/form-data')) {
          // 使用 multipart/form-data 类型提交表单
        }
      }
    },
    onProxyRes: (/*proxyRes, req, res*/) => { // 代理目标响应接收后触发
    },
    onError: (/*err, req, res*/) => { // 代理目标出现错误后触发
    }
  }
};

// webpack-dev-server 插件的 setup 配置
let devServerSetup = (app) => {
  // Express 中间件
  app.use(bodyParser.json()); // 解析 application/json
  app.use(bodyParser.urlencoded({ extended: false })); // 解析 application/x-www-form-urlencoded
  app.use(multer().any()); // 解析 multipart/form-data
  app.use(cookieParser()); // 解析 cookie

  // 拦截 mocks 目录
  app.use('/mocks', (req, res, next) => {
    // 物理路径
    let pathObject = path.parse(req.path);
    let jsFilePath = path.join(defaults.mockPath, pathObject.dir, pathObject.name + '.js');
    let jsonFilePath = path.join(defaults.mockPath, pathObject.dir, pathObject.name + '.json');
    
    if(fs.existsSync(jsFilePath)) { // 检查 js 文件
      delete require.cache[require.resolve(jsFilePath)];
      let jsModule = require(jsFilePath);
      let jsonRet = jsModule(req, res, app);
      res.json(jsonRet);
    }
    else if(fs.existsSync(jsonFilePath)) { // 检查 json 文件
      delete require.cache[require.resolve(jsonFilePath)];
      let jsonModule = require(jsonFilePath);
      res.json(jsonModule);
    }
    else { // 转交控制权
      next();
    }
  });
};

// 获取入口配置
let getEntries = () => {
  let newEntries = {};

  for (let key in base.entry) {
    newEntries[key] = [
      `webpack-dev-server/client?http://127.0.0.1:${defaults.port}/`, // Automatic Refresh - Inline mode
      'webpack/hot/only-dev-server' // Automatic Refresh - Hot Module Replacement
    ].concat(base.entry[key]);
  }

  return newEntries;
};

// 获取加载器
let getModules = () => {
  let newLoaders = [].concat(
    base.module.loaders,
    {
      test: /\.(js|jsx)$/,
      loader: 'react-hot-loader!es3ify-loader!babel-loader?cacheDirectory',
      include: defaults.srcPath
    }
  );

  return Object.assign({}, base.module, {
    loaders: newLoaders
  });
};

// 获取插件
let getPlugins = () => {
  let param = defaults.getDefinePluginParam({
    defineEnv: 'dev',
    defineDebug: true,
    publicPagePath,
    publicPageFullname,
    publicAssetPath,
    publicRpcPath
  });

  return [].concat(
    base.plugins,
    defaults.getHtmlWebpackPlugins(defaults.srcPath),
    new webpack.DefinePlugin(param),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  );
};

// 扩展基础配置
let config = Object.assign({}, base, {
  debug: true,
  cache: true,
  devtool: 'cheap-module-source-map'
});

config.output.publicPath = publicAssetPath;
config.devServer.publicPath = publicAssetPath;
config.devServer.proxy = devServerProxy;
config.devServer.setup = devServerSetup;
config.entry = getEntries();
config.module = getModules();
config.plugins = getPlugins();

module.exports = config;