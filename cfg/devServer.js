let fs = require('fs');
let path = require('path');
let bodyParser = require('body-parser');
let multer = require('multer');
let cookieParser = require('cookie-parser');

let defaults = require('./defaults');

// setup 配置
let devServerSetup = (prefix) => {
  prefix = prefix ? prefix : '/mocks/'; // 默认前缀

  // 调用 mock 模块
  let callMockModule = (req, res) => {
    // 查找 mock 文件
    let pathObject = path.parse(req.path);
    let jsFilePath = path.join(defaults.mockPath, pathObject.dir, pathObject.name + '.js');
    let jsonFilePath = path.join(defaults.mockPath, pathObject.dir, pathObject.name + '.json');
    let globalFilePath = path.join(defaults.mockPath, 'global.js');

    if (fs.existsSync(jsFilePath)) { // 检查 js 文件
      delete require.cache[require.resolve(jsFilePath)]; // 为了便利牺牲性能
      let jsModule = require(jsFilePath);
      jsModule(req, res); // 执行函数
    }
    else if (fs.existsSync(jsonFilePath)) { // 检查 json 文件
      delete require.cache[require.resolve(jsonFilePath)]; // 为了便利牺牲性能
      let jsonModule = require(jsonFilePath);
      res.json(jsonModule); // 输出 json
    }
    else if (fs.existsSync(globalFilePath)) { // 检查 global.js 文件
      delete require.cache[require.resolve(globalFilePath)]; // 为了便利牺牲性能
      let globalModule = require(globalFilePath);
      globalModule(req, res); // 执行函数
    }
  };

  return (app) => {
    // Express 中间件
    app.use(bodyParser.json()); // 解析 application/json
    app.use(bodyParser.urlencoded({ extended: false })); // 解析 application/x-www-form-urlencoded
    app.use(multer().any()); // 解析 multipart/form-data
    app.use(cookieParser()); // 解析 cookie

    // 拦截 mocks 目录
    app.use(prefix, (req, res, next) => {
      // 调用 mock 模块
      callMockModule(req, res);
      // 转交控制权
      next();
    });
  };
};

//  proxy 配置
let devServerProxy = (prefix, target) => {
  prefix = prefix ? prefix : '/proxy/'; // 默认前缀
  target = target ? target : `${defaults.https ? 'https' : 'http'}://127.0.0.1:${defaults.port}/`; // 默认目标

  // 代理含有 body 的请求
  let proxyReqBody = (proxyReq, req/*, res*/) => {
    /**
     * 当代理请求含有 body 时 http-proxy-middleware 与 body-parser 有冲突。
     * [Modify Post Parameters](https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/modify-post.md)
     * [Edit proxy request/response POST parameters](https://github.com/chimurai/http-proxy-middleware/issues/61)
     * [socket hang up error with nodejs](http://stackoverflow.com/questions/25207333/socket-hang-up-error-with-nodejs)
     */
    let body = req.body;
    let contentType = req.get('Content-Type');
    contentType = contentType ? contentType.toLowerCase() : '';

    if (body) {
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
  };

  return {
    [prefix]: {
      target: target, // 目标地址必须含有协议头（如 http:// 等）
      pathRewrite: {
        ['^' + prefix]: '/'
      },
      logLevel: 'debug', // 修改日志等级
      secure: false, // 忽略检查代理目标的 SSL 证书
      changeOrigin: true, // 修改代理目标请求头中的 host 为目标源
      // cookieDomainRewrite: false, // 修改 cookie 所属域
      onProxyReq: (proxyReq, req, res) => { // 代理目标请求发出前触发
        // 代理含有 body 的请求
        proxyReqBody(proxyReq, req, res);
      },
      onProxyRes: (/*proxyRes, req, res*/) => { // 代理目标响应接收后触发
      },
      onError: (/*err, req, res*/) => { // 代理目标出现错误后触发
      }
    }
  };
};

module.exports = (cfg) => {
  return {
    hot: true,
    inline: true,
    compress: true,
    disableHostCheck: true,
    port: defaults.port,
    publicPath: cfg.publicPath,
    setup: devServerSetup(cfg.mockPrefix),
    proxy: devServerProxy(cfg.proxyPrefix, cfg.proxyTarget),
    contentBase: path.join(defaults.distPath, defaults.version),
    stats: {
      colors: true,
      children: false,
      modules: false
    },
    https: defaults.https ? {
      key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem'), 'utf8'),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'), 'utf8'),
      cacert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'), 'utf8')
    } : undefined
  };
};