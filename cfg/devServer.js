const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');

module.exports = (envCfg, pathsCfg, publishCfg, proxyCfg = {}) => {
  // setup 配置
  const devServerSetup = (prefix) => {
    if (!prefix) {
      return;
    }

    // 调用 mock 模块
    let callMockModule = (req, res, next) => {
      // 查找 mock 文件
      let pathObject = path.parse(req.path);
      let jsFilePath = path.join(pathsCfg.mockPath, pathObject.dir, pathObject.name + '.js');
      let jsonFilePath = path.join(pathsCfg.mockPath, pathObject.dir, pathObject.name + '.json');
      let globalFilePath = path.join(pathsCfg.mockPath, 'global.js');

      if (fs.existsSync(jsFilePath)) { // 检查 js 文件
        delete require.cache[require.resolve(jsFilePath)]; // 为了便利牺牲性能
        let jsModule = require(jsFilePath);
        jsModule(req, res, next); // 执行函数
      }
      else if (fs.existsSync(jsonFilePath)) { // 检查 json 文件
        delete require.cache[require.resolve(jsonFilePath)]; // 为了便利牺牲性能
        let jsonModule = require(jsonFilePath);
        res.json(jsonModule); // 输出 json
      }
      else if (fs.existsSync(globalFilePath)) { // 检查 global.js 文件
        delete require.cache[require.resolve(globalFilePath)]; // 为了便利牺牲性能
        let globalModule = require(globalFilePath);
        globalModule(req, res, next); // 执行函数
      }
    };

    return (app) => {
      // Express 中间件
      app.use(bodyParser.json()); // 解析 application/json
      app.use(bodyParser.urlencoded({ extended: false })); // 解析 application/x-www-form-urlencoded
      app.use(multer().any()); // 解析 multipart/form-data
      app.use(cookieParser()); // 解析 cookie

      // 拦截 mock 目录
      app.use(prefix, (req, res, next) => {
        // 调用 mock 模块
        callMockModule(req, res, next);
      });
    };
  };

  //  proxy 配置
  const devServerProxy = (prefixs, targets) => {
    if (!(prefixs && prefixs.length > 0
      && targets && targets.length > 0
      && prefixs.length === targets.length)) {
      return;
    }

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

    // 代理配置项
    let proxyCfgItem = (prefix, target) => {
      return {
        [prefix]: {
          target: target, // 目标地址必须含有协议头（如 http:// 等）
          pathRewrite: {
            ['^' + prefix]: '/'
          },
          logLevel: 'debug', // 修改日志等级
          secure: false, // 忽略检查代理目标的 SSL 证书
          changeOrigin: true, // 修改代理目标请求头中的 host 为目标源
          cookieDomainRewrite: false, // 修改 cookie 所属域
          onProxyReq: (proxyReq, req, res) => { // 代理目标请求发出前触发
            // 代理含有 body 的请求
            proxyReqBody(proxyReq, req, res);
          },
          /* onProxyRes: (proxyRes, req, res) => { // 代理目标响应接收后触发
          }, */
          onError: (err, req, res) => { // 代理目标出现错误后触发
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.end(err.toString());
          }
        }
      };
    };

    let proxyObj = {};

    // 多项代理配置
    for (let i = 0; i < prefixs.length; i++) {
      let prefix = prefixs[i];
      let target = targets[i];
      let cfgItem = proxyCfgItem(prefix, target);
      proxyObj = Object.assign(proxyObj, cfgItem);
    }

    return proxyObj;
  };

  return {
    hot: true,
    inline: true,
    overlay: true,
    compress: true,
    useLocalIp: true,
    disableHostCheck: true,
    port: envCfg.port,
    hotOnly: envCfg.hotOnly,
    headers: envCfg.headers,
    publicPath: publishCfg.publicAssetPath,
    contentBase: pathsCfg.portalPath,
    historyApiFallback: envCfg.historyApi,
    before: devServerSetup(proxyCfg.mockPathPrefix),
    proxy: devServerProxy(proxyCfg.proxyPathPrefixs, proxyCfg.proxyTargetDomains),
    stats: {
      colors: true,
      entrypoints: false,
      modules: false,
      children: false
    },
    https: envCfg.https ? {
      key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem'), 'utf8'),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'), 'utf8'),
      cacert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'), 'utf8')
    } : undefined
  };
};