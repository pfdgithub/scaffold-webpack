import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { initIntl } from 'commons/locale';

import Main from './Main';
import Global from './Global';

const intlCfg = initIntl();

const AppRouter = () => (
  <IntlProvider locale={intlCfg.locale} messages={intlCfg.messages}>
    <React.Fragment key={intlCfg.locale}>
      <Router>
        <Route>
          {props => <Main {...props} />}
        </Route>
      </Router>
      <Global />
    </React.Fragment>
  </IntlProvider>
);

export default AppRouter;
