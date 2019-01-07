import React from 'react';
// import cls from 'classnames';
import db from 'sources/db.inner';

import EntryBase from '../Common/EntryBase';
import stl from './styles/App.less';
import logo from './images/logo.png';

class App extends EntryBase {
  constructor(props) {
    super(props);
    this.state = {
      legacy: {},
      rest: {}
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
      <div className={stl.app}>
        <img src={logo} />
        <br />
        <br />
        <a onClick={this.getLegacyData}>传统风格接口</a>
        <br />
        {JSON.stringify(this.state.legacy)}
        <br />
        <br />
        <a onClick={this.getRestData}>REST 风格接口</a>
        <br />
        {JSON.stringify(this.state.rest)}
      </div>
    );
  }

  // 传统风格接口
  getLegacyData = () => {
    db.legacy.state({
      clientTime: Date.now()
    }).then(this.unmountCheck((content) => {
      this.setState({
        legacy: content.data
      });
    })).catch(this.unmountCheck((error) => {
      alert(error.message);
    }));
  }

  // REST 风格接口
  getRestData = () => {
    db.rest.state({
      ':state': 123,
      clientTime: Date.now()
    }).then(this.unmountCheck((content) => {
      this.setState({
        rest: content.data
      });
    })).catch(this.unmountCheck((error) => {
      alert(error.message);
    }));
  }

}

export default App;
