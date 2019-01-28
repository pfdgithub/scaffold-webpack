import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Main from './Main';
import Global from './Global';

const AppRouter = () => (
  <React.Fragment>
    <Router>
      <Route>
        {props => <Main {...props} />}
      </Route>
    </Router>
    <Global />
  </React.Fragment>
);

export default AppRouter;
