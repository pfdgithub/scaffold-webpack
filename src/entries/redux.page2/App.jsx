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
    let { fetchState, restData } = this.props;

    return (
      <div className={classnames(styles.app)}>
        <a onClick={this.getRestData}>REST 风格接口</a>
        <br />
        ----------------------------
        <br />
        {JSON.stringify(fetchState)}
        <br />
        ----------------------------
        <br />
        {JSON.stringify(restData)}
      </div>
    );
  }

  getRestData = () => {
    let { fetchRest } = this.props;
    fetchRest();
  }

}

export default App;
