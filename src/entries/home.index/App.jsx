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
        <img src={logo} onClick={this.testState} />
        <br/>
        <span>微贷网</span>
        <br/>
        {JSON.stringify(this.state.output)}
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
}

export default App;