const notfound = {
  title: '404',
  path: '/notfound'
};

const home = {
  title: '首页',
  path: '/home',
  index: {
    title: '主页',
    path: '/home/index'
  }
};

export const routes = {
  notfound,
  home
};

export const routeCfg = {
  root: '/',
  default: routes.home.index.path
};

const findRoutes = (path, routes) => {
  let ret = [];

  if (path) {
    for (let key in routes) {
      let route = routes[key];
      if (Object.prototype.toString.call(route) === '[object Object]') {
        if (route.path === path) {
          ret = ret.concat(route);
          break;
        }
        else {
          let arr = findRoutes(path, route);
          if (arr.length > 0) {
            ret = ret.concat(route, arr);
            break;
          }
        }
      }
    }
  }

  return ret;
};

export const parseRoutes = (path) => {
  return findRoutes(path, routes);
};
