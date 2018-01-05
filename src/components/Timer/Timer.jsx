import React from 'react';

import ComponentBase from '../Common/ComponentBase';
import styles from './styles/Timer.less';
import util from 'commons/util';

class Timer extends ComponentBase {
  _intervalId = 0;

  constructor(props) {
    super(props);
    this.state = {
      time: Date.now()
    };
  }

  componentDidMount() {
    super.componentDidMount();

    this._intervalId = setInterval(() => {
      this.setState({
        time: Date.now()
      });
    }, 1000);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    clearInterval(this._intervalId);
  }

  render() {
    return (
      <span className={styles.timer}>
        {util.msecToString(this.state.time, 'yyyy-MM-dd HH:mm:ss')}
      </span>
    );
  }
}

export default Timer;