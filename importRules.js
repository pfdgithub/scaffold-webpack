/**
 * babel-plugin-imports 插件配置
 */

// 驼峰转减号
let camel2Dash = (name) => {
  let _name = name[0].toLowerCase() + name.substring(1);
  return _name.replace(/([A-Z])/g, function (letter) {
    return '-' + letter.toLowerCase();
  });
};

// 驼峰转下划线
let camel2Underline = (name) => {
  let _name = name[0].toLowerCase() + name.substring(1);
  return _name.replace(/([A-Z])/g, function (letter) {
    return '_' + letter.toLowerCase();
  });
};

let rules = {
  'antd': {
    importSpecifier: (importType, moduleName, importedName, localName) => {
      let dashName = camel2Dash(importedName);
      return [
        {
          newImportType: 'ImportDefaultSpecifier',
          newModuleName: `${moduleName}/es/${dashName}/style`,
          newImportedName: `${importedName}Style`,
          newLocalName: `${localName}Style`
        },
        {
          newImportType: 'ImportDefaultSpecifier',
          newModuleName: `${moduleName}/es/${dashName}`
        }
      ];
    }
  }

};

let ruleExtend = {
  moduleName: (moduleName) => {
    return !!rules[moduleName];
  },
  importType: {
    importSpecifier: {
      transforms: (importType, moduleName, importedName, localName) => {
        return rules[moduleName].importSpecifier(importType, moduleName, importedName, localName);
      }
    }
  }
};

module.exports = ruleExtend;