let fs = require('fs');
let path = require('path');

module.exports = (req, res) => {
  // 检查 REST 配置
  let restFilePath = path.join(__dirname, './rest.json');
  if (fs.existsSync(restFilePath)) { // 检查 json 文件
    delete require.cache[require.resolve(restFilePath)];
    let restModule = require(restFilePath);

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

      return {
        api: api,
        pattern: apiPattern,
        mock: mockPath,
        params: params
      };
    });

    // 遍历接口对象数组，找到匹配当前请求的第一个对象
    let paramValues = [];
    let matchApiObj = restApiObjArr.find((apiObj) => {
      let reg = new RegExp(apiObj.pattern);
      let matchArr = req.path.match(reg);
      if (matchArr) {
        // 从当前请求中提取参数值
        paramValues = matchArr.filter((match, index) => {
          return index > 0 && index <= apiObj.params.length;
        });
        return true; // 找到第一个后就跳出循环
      }
    });

    if (matchApiObj) {
      // 保存 REST 参数
      let restParam = {};
      matchApiObj.params.forEach((param, index) => {
        restParam[param] = paramValues[index];
      });
      res.locals.restParam = restParam;

      // 查找 mock 文件
      let pathObject = path.parse(matchApiObj.mock);
      let jsFilePath = path.join(__dirname, pathObject.dir, pathObject.name + '.js');
      let jsonFilePath = path.join(__dirname, pathObject.dir, pathObject.name + '.json');
      if (fs.existsSync(jsFilePath)) { // 检查 js 文件
        delete require.cache[require.resolve(jsFilePath)];
        let jsModule = require(jsFilePath);
        jsModule(req, res); // 执行函数
      }
      else if (fs.existsSync(jsonFilePath)) { // 检查 json 文件
        delete require.cache[require.resolve(jsonFilePath)];
        let jsonModule = require(jsonFilePath);
        res.json(jsonModule); // 输出 json
      }
      else {
        res.status(404).send(`${req.path}\n${matchApiObj.api}\n已发现与该路径模式相匹配的 REST 风格接口配置，但未发现对应的 mock 文件。`);
      }
    }
    else {
      res.status(404).send(`${req.path}\n未发现与该路径模式相匹配的 REST 风格接口配置，请在 mocks/rest.json 文件中配置。`);
    }
  }
  else {
    res.status(404).send(`${req.path}\nNot Found`);
  }
};