import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { getAsyncCom } from './AsyncCom';

// 异步加载
const homeIndex = getAsyncCom(() => import(/* webpackChunkName: "chunk-home.index" */ '../home.index/AppHot'));
const homeNotFound = getAsyncCom(() => import(/* webpackChunkName: "chunk-home.notFound" */ '../home.notFound/AppHot'));

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/home.index.html" component={homeIndex} />
      <Route path="/home.notFound.html" component={homeNotFound} />

      <Redirect exact from="/" to="/home.index.html" />
      <Route component={homeNotFound} />
    </Switch>
  </Router>
);

export default AppRouter;
