import React from 'react';
// import cls from 'classnames';
import { Route, Switch } from 'react-router-dom';
import routes from 'commons/routes';
import DocTitle from 'components/DocTitle';
import Notfound from 'views/Notfound';

import ViewBase from '../Common/ViewBase';
// import stl from './styles/App.less';
import Main from './Main';

class App extends ViewBase {
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
      <React.Fragment>
        <Switch>
          <Route path={routes.home.index.path} render={(props) => (
            <DocTitle title={routes.home.index.title}><Main {...this.props} {...props} /></DocTitle>
          )} />
          <Route component={Notfound} />
        </Switch>
      </React.Fragment>
    );
  }

}

export default App;
