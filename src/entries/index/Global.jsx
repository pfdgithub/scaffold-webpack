import React from 'react';
import { connect } from 'react-redux';
import { user } from 'states/actions';

import EntryBase from '../Common/EntryBase';

// #region 用来放置整个应用需要的初始化操作

class Global extends EntryBase {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();

    this.initApp();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    return (
      <React.Fragment />
    );
  }

  initApp = () => {
    let { fetchAccount } = this.props;

    // 检查登录
    fetchAccount();
  }

}

// #endregion

// #region redux 包装

const mapStateToProps = (/* state */) => {
  return {
  };
};

const mapDispatchToProps = {
  fetchAccount: user.fetchAccount
};

const GlobalConnecter = connect(mapStateToProps, mapDispatchToProps)(Global);

export default GlobalConnecter;

// #endregion
