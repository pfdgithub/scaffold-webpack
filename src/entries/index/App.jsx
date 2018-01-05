import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { getAsyncCom } from './AsyncCom';

// 同步加载
// import homeIndex from '../home.index/App';
// import homeNotFound from '../home.notFound/App';

// 异步加载
const homeIndex = getAsyncCom(() => import(/* webpackChunkName: "chunk-home.index" */ '../home.index/App'));
const homeNotFound = getAsyncCom(() => import(/* webpackChunkName: "chunk-home.notFound" */ '../home.notFound/App'));

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/home.index" component={homeIndex} />
      <Route path="/home.notFound" component={homeNotFound} />

      <Redirect exact from="/" to="/home.index" />
      <Route component={homeNotFound} />
    </Switch>
  </Router>
);

export default AppRouter;
