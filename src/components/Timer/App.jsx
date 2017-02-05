import React from 'react';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import style from './styles/App.less';
import util from 'commons/util';

let intervalId = 0;

class App extends ComponentBase {
  constructor(props) {
    super(props);
    this.state = {
      time: Date.now()
    };
  }

  componentDidMount() {
    super.componentDidMount();

    intervalId = setInterval(() => {
      this.setState({
        time: Date.now()
      });
    }, 1000);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    clearInterval(intervalId);
  }

  render() {
    return (
      <span className={cls(style.App)}>
        {util.msecToString(this.state.time, 'yyyy-MM-dd HH:mm:ss')}
      </span>
    );
  }
}

export default App;