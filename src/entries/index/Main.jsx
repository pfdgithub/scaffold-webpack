import React from 'react';
// import cls from 'classnames';
import { Route, Switch, Redirect } from 'react-router-dom';
import { routes, routeCfg } from 'commons/routes';
import { createDocTitle } from 'components/DocTitle';

import { createAsyncCom } from '../Common/AsyncCom';
import EntryBase from '../Common/EntryBase';
// import stl from './styles/Main.less';

// // 同步加载
// import Home from 'views/Home';
// import Notfound from 'views/Notfound';

// 异步加载
const Home = createAsyncCom(() => import(/* webpackChunkName: "c-home" */ 'views/Home'));
const Notfound = createAsyncCom(() => import(/* webpackChunkName: "c-notfound" */ 'views/Notfound'));

class Main extends EntryBase {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    return (
      <Switch>
        <Route path={routes.home.path} render={createDocTitle(routes.home.title)(Home)} />

        <Redirect exact from={routeCfg.root} to={routeCfg.default} />
        <Route render={createDocTitle(routes.notfound.title)(Notfound)} />
      </Switch>
    );
  }

}

export default Main;
