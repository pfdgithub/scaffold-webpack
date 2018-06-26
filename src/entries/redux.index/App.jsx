import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { createAsyncCom } from '../Common/AsyncCom';
import { createDocTitle } from '../Common/DocTitle';

// 异步加载
const reduxPage1 = createAsyncCom(() => import(/* webpackChunkName: "chunk-redux.page1" */ '../redux.page1/AppHot'));
const reduxPage2 = createAsyncCom(() => import(/* webpackChunkName: "chunk-redux.page2" */ '../redux.page2/AppHot'));

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/page1" component={createDocTitle('redux 1')(reduxPage1)} />
      <Route path="/page2" component={createDocTitle('redux 2')(reduxPage2)} />

      <Redirect exact from="/" to="/page1" />
    </Switch>
  </Router>
);

export default AppRouter;
