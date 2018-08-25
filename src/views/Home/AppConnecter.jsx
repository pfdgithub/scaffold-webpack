import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { user } from 'states/actions';

import App from './App';

const mapStateToProps = (state) => {
  return {
    isLogined: state.user.isLogined,
    account: state.user.account
  };
};

const mapDispatchToProps = {
  updateAccount: user.updateAccount,
  fetchAccount: user.fetchAccount
};

const AppConnecter = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default AppConnecter;
