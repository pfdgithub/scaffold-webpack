const fs = require('fs');
const path = require('path');

// 查找 REST 配置
const findRestCfg = () => {
  let restModule = null;
  let jsFilePath = path.join(__dirname, './rest.js');
  let jsonFilePath = path.join(__dirname, './rest.json');

  if (fs.existsSync(jsFilePath)) { // 检查 js 文件
    delete require.cache[require.resolve(jsFilePath)]; // 为了便利牺牲性能
    restModule = require(jsFilePath);
  }
  else if (fs.existsSync(jsonFilePath)) { // 检查 json 文件
    delete require.cache[require.resolve(jsonFilePath)]; // 为了便利牺牲性能
    restModule = require(jsonFilePath);
  }

  return restModule;
};

// 解析 REST 配置
const parseRestCfg = (restModule) => {
  // REST 风格的接口数组
  let restApiArr = restModule.apiList ? restModule.apiList : [];

  // 将接口数组处理为接口对象数组
  let restApiObjArr = restApiArr.map((api) => {
    let apiPattern = api; // 接口对应的正则表达式
    let mockPath = api; // 接口对应的 mock 数据路径
    let params = []; // 接口中包含的参数名称

    let placeholderArr = api.match(/:[\w-]+/g); // 找到接口中的参数占位符
    if (placeholderArr) {
      placeholderArr.forEach((placeholder) => {
        let param = placeholder.replace(':', ''); // 提取参数名称
        apiPattern = apiPattern.replace(placeholder, '([\\w-]+)'); // 把占位符替换正则表达式
        mockPath = mockPath.replace(placeholder, param); // 把占位符替换为参数名称
        params.push(param); // 记录参数名称
      });
    }
    apiPattern = '^' + apiPattern + '$'; // 严格匹配请求路径（不含后缀）

    return {
      api: api,
      pattern: apiPattern,
      mock: mockPath,
      params: params
    };
  });

  return restApiObjArr;
};

// 匹配请求接口
const matchReqApi = (restApiObjArr, req) => {
  let values = [];

  // 遍历接口对象数组，找到匹配当前请求的第一个对象
  let matchApiObj = restApiObjArr.find((apiObj) => {
    let reg = new RegExp(apiObj.pattern);
    let pathObject = path.parse(req.path); // 移除请求路径后缀
    let noExt = `${pathObject.dir}/${pathObject.name}`;
    let matchArr = noExt.match(reg);
    if (matchArr) {
      // 从当前请求中提取参数值
      values = matchArr.filter((match, index) => {
        return index > 0 && index <= apiObj.params.length;
      });
      return true; // 找到第一个后就跳出循环
    }
  });

  if (matchApiObj) {
    // 合成 REST 参数
    let restParam = {};
    matchApiObj.params.forEach((param, index) => {
      restParam[param] = values[index];
    });

    // 合并对象
    return Object.assign({}, matchApiObj, {
      values: values,
      restParam: restParam
    });
  }
  else {
    return undefined;
  }
};

// 调用 mock 模块
const callMockModule = (matchApiObj, req, res) => {
  // 查找 mock 文件
  let pathObject = path.parse(matchApiObj.mock);
  let jsFilePath = path.join(__dirname, pathObject.dir, pathObject.name + '.js');
  let jsonFilePath = path.join(__dirname, pathObject.dir, pathObject.name + '.json');
  if (fs.existsSync(jsFilePath)) { // 检查 js 文件
    delete require.cache[require.resolve(jsFilePath)]; // 为了便利牺牲性能
    let jsModule = require(jsFilePath);
    jsModule(req, res); // 执行函数
    return true;
  }
  else if (fs.existsSync(jsonFilePath)) { // 检查 json 文件
    delete require.cache[require.resolve(jsonFilePath)]; // 为了便利牺牲性能
    let jsonModule = require(jsonFilePath);
    res.json(jsonModule); // 输出 json
    return true;
  }
  else {
    return false;
  }
};

module.exports = (req, res) => {
  // 查找 REST 配置
  let restModule = findRestCfg();
  if (restModule) {
    // 解析 REST 配置
    let restApiObjArr = parseRestCfg(restModule);
    // 匹配请求接口
    let matchApiObj = matchReqApi(restApiObjArr, req);
    if (matchApiObj) {
      // 保存请求路径中携带的参数
      res.locals.restParam = matchApiObj.restParam;
      // 调用 mock 模块
      let callSuccess = callMockModule(matchApiObj, req, res);
      if (!callSuccess) {
        res.status(404).send(`${req.path}\n${matchApiObj.api}\n已发现与该路径模式相匹配的 REST 风格接口配置，但未发现对应的 mock 文件。`);
      }
    }
    else {
      res.status(404).send(`${req.path}\n未发现与该路径模式相匹配的 REST 风格接口配置，请在 rest.js 或 rest.json 文件中配置。`);
    }
  }
  else {
    res.status(404).send(`${req.path}\nNot Found`);
  }
};