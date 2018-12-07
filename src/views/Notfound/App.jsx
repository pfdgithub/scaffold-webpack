import React from 'react';
// import cls from 'classnames';

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
        </div>
      </div>
    );
  }
}

export default App;
