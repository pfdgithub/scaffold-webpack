import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { createAsyncCom } from '../Common/AsyncCom';
import { createDocTitle } from '../Common/DocTitle';

// 异步加载
const homeIndex = createAsyncCom(() => import(/* webpackChunkName: "chunk-home.index" */ '../home.index/AppHot'));
const homeNotFound = createAsyncCom(() => import(/* webpackChunkName: "chunk-home.notFound" */ '../home.notFound/AppHot'));

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/home.index.html" component={createDocTitle('首页')(homeIndex)} />
      <Route path="/home.notFound.html" component={createDocTitle('404')(homeNotFound)} />

      <Redirect exact from="/" to="/home.index.html" />
      <Route component={homeNotFound} />
    </Switch>
  </Router>
);

export default AppRouter;
