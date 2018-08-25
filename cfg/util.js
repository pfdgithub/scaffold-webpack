// 环境枚举
const envEnum = {
  dev: 'dev',
  test: 'test',
  prod: 'prod'
};

// 深度递归 Object.assign
const deepAssign = (target, ...sources) => {
  let to = Object(target);

  // 遍历来源对象数组
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    // 检查是否为简单对象
    if (Object.prototype.toString.call(source) !== '[object Object]') {
      to = Object.assign(to, source);
      continue;
    }

    // 遍历来源对象
    for (let key in source) {
      // 是否为自身属性
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        let val = source[key];
        // 检查是否为简单对象
        if (Object.prototype.toString.call(val) !== '[object Object]') {
          to[key] = val;
          continue;
        }

        // 递归调用
        to[key] = deepAssign(to[key], val);
      }
    }
  }

  return to;
};

// 环境和部署配置
const getPkgCfg = (pkg, env) => {
  let scaffoldCfg = pkg.scaffold || {}; // 脚手架配置

  // 环境配置
  let envCfg = scaffoldCfg[env] || {};

  // 部署配置
  let deployCfg = deepAssign({}, scaffoldCfg.deploy, envCfg.deploy, {
    _env: env
  });

  return {
    envCfg,
    deployCfg
  };
};

// 获取入口页面对象（项目页面全名）
const getPublicPageFullname = (entryPages, pageSuffix, publicPagePath) => {
  let pageObj = {};
  entryPages.forEach((entryPage) => {
    let separators = entryPage.name.split('.');
    let temp = pageObj;
    separators.forEach((separator, index, array) => {
      if (index === array.length - 1) {
        temp[separator] = publicPagePath + entryPage.name + pageSuffix;
      }
      else {
        if (separator in temp) {
          temp = temp[separator];
        }
        else {
          temp = temp[separator] = {};
        }
      }
    });
  });
  return pageObj;
};

module.exports = {
  envEnum,
  deepAssign,
  getPkgCfg,
  getPublicPageFullname
};