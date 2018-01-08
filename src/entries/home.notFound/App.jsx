import React from 'react';
import classnames from 'classnames';

import EntryBase from '../Common/EntryBase';
import styles from './styles/App.less';

class NotFound extends EntryBase {
  constructor(props) {
    super(props);
    this.state = {
      backUrl: ''
    };
  }

  componentDidMount() {
    super.componentDidMount();

    this.init();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { backUrl } = this.state;

    return (
      <div className={classnames(styles.app)}>
        <div className={classnames(styles.container)}>
          <div className={classnames(styles.code)}>404</div>
          <div className={classnames(styles.text)}>页面丢失了</div>
          <div className={classnames(styles.url)} onClick={this.back}>{backUrl}</div>
        </div>
      </div>
    );
  }

  init = () => {
    let param = this.parseUrlParam();

    this.setState({
      backUrl: param.query.backUrl
    });
  }

  back = () => {
    this.backPage();
  }
}

export default NotFound;
