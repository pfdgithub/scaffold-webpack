import React from 'react';
import classnames from 'classnames';

import EntryBase from '../Common/EntryBase';
import styles from './styles/App.less';

class App extends EntryBase {
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
    let { fetchState, legacyData } = this.props;

    return (
      <div className={classnames(styles.app)}>
        <a onClick={this.getLegacyData}>传统风格接口</a>
        <br />
        ----------------------------
        <br />
        {JSON.stringify(fetchState)}
        <br />
        ----------------------------
        <br />
        {JSON.stringify(legacyData)}
      </div>
    );
  }

  getLegacyData = () => {
    let { fetchLegacy } = this.props;
    fetchLegacy();
  }

}

export default App;