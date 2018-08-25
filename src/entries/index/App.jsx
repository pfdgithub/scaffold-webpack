import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import routes from 'commons/routes';
import { createDocTitle } from 'components/DocTitle';

import { createAsyncCom } from '../Common/AsyncCom';
import Global from './Global';

// // 同步加载
// import Home from 'views/Home';
// import Notfound from 'views/Notfound';

// 异步加载
const Home = createAsyncCom(() => import(/* webpackChunkName: "c-home" */ 'views/Home'));
const Notfound = createAsyncCom(() => import(/* webpackChunkName: "c-notfound" */ 'views/Notfound'));

const AppRouter = () => (
  <React.Fragment>
    <Router>
      <Switch>
        <Route path={routes.home.path} component={createDocTitle(routes.home.title)(Home)} />

        <Redirect exact from="/" to={routes.home.index.path} />
        <Route component={createDocTitle(routes.notfound.title)(Notfound)} />
      </Switch>
    </Router>
    <Global />
  </React.Fragment>
);

export default AppRouter;
