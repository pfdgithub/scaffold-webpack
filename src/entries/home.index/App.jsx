import React from 'react';
import classnames from 'classnames';

import EntryBase from '../Common/EntryBase';
import styles from './styles/App.less';
import logo from './images/logo.png';
import db from 'sources/db.inner';

class App extends EntryBase {
  constructor(props) {
    super(props);
    this.state = {
      output: {}
    };
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    return (
      <div className={classnames(styles.App)}>
        <img src={logo} />
        <br />
        <span onClick={this.getState}>点击此处模拟数据</span>
        <br />
        {JSON.stringify(this.state.output)}
        <br />
        <span onClick={this.codeSplitting}>点击此处加载视图</span>
      </div>
    );
  }

  getState = () => {
    // 传统风格接口
    db.legacy.state({
      clientTime: Date.now()
    }).then(this.unmountCheck((content) => {
      this.setState({
        output: content.data
      });
    })).catch(this.unmountCheck((error) => {
      alert(error.message);
    }));

    // REST 风格接口
    db.rest.state({
      ':state': 123,
      clientTime: Date.now()
    }).then(this.unmountCheck((content) => {
      /* eslint-disable */
      console.log(content.data);
      /* eslint-enable */
    })).catch(this.unmountCheck((error) => {
      alert(error.message);
    }));
  }

  codeSplitting = () => {
    require.ensure([], (require) => {
      let TimerContainer = require('views/TimerContainer').default;
      TimerContainer.init();

      if (module.hot) {
        module.hot.accept('views/TimerContainer', () => {
          let TimerContainerNew = require('views/TimerContainer').default;
          TimerContainerNew.init();
        });
      }
    });
  }
}

export default App;