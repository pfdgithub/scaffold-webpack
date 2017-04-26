let fs = require('fs');
let path = require('path');

module.exports = (req, res) => {
  // 检查 REST 配置
  let restFilePath = path.join(__dirname, './rest.js');
  if (fs.existsSync(restFilePath)) { // 检查 js 文件
    delete require.cache[require.resolve(restFilePath)];
    let restModule = require(restFilePath);
    restModule(req, res); // 执行函数
  }
  else {
    res.status(404).send(`${req.path}\nNot Found`);
  }
};