import React from 'react';
import classnames from 'classnames';

import EntryBase from '../Common/EntryBase';
import styles from './styles/App.less';

class NotFound extends EntryBase {
  constructor(props) {
    super(props);
    this.state = {
      navBarTitle: document.title
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
      <div className={classnames(styles.app)}>
        <div className={classnames(styles.container)}>
          <div className={classnames(styles.code)}>404</div>
          <div className={classnames(styles.text)}>页面丢失了</div>
        </div>
      </div>
    );
  }
}

export default NotFound;
