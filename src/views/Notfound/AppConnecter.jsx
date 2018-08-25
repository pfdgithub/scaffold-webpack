import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { } from 'states/actions';

import App from './App';

const mapStateToProps = (/* state */) => {
  return {
  };
};

const mapDispatchToProps = {
};

const AppConnecter = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default AppConnecter;
