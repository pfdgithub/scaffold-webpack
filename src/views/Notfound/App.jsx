import React from 'react';
// import cls from 'classnames';
import { Link } from 'react-router-dom';
import routes from 'commons/routes';
// import DocTitle from 'components/DocTitle';

import ViewBase from '../Common/ViewBase';
import stl from './styles/App.less';

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
      <div className={stl.app}>
        <div className={stl.container}>
          <div className={stl.code}>404</div>
          <div className={stl.text}>页面丢失了</div>
          <Link className={stl.link} replace to={routes.home.index.path}>回到首页</Link>
        </div>
      </div>
    );
  }
}

export default App;
