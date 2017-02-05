import React from 'react';
import cls from 'classnames';

import EntryBase from '../Common/EntryBase';
import style from './styles/App.less';
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
      <div className={cls(style.App)}>
        <img src={logo} />
        <br/>
        <span onClick={this.testState}>点击此处模拟数据</span>
        <br/>
        {JSON.stringify(this.state.output)}
        <br/>
        <span onClick={this.codeSplitting}>点击此处加载视图</span>
      </div>
    );
  }

  testState = () => {
    db.test.state({
      clientTime: Date.now()
    }).then(this.unmountCheck((content) => {
      this.setState({
        output: content.data
      });
    })).catch(this.unmountCheck((error) => {
      alert(error.message);
    }));
  }

  codeSplitting = () => {
    require.ensure([], (require) => {
      let TimerContainer = require('views/TimerContainer').default;
      TimerContainer.init();
    });
  }
}

export default App;