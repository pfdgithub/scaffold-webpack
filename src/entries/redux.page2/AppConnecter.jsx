import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mock } from 'states/actions';

import App from './App';

const mapStateToProps = (state) => {
  return {
    fetchState: state.global.fetchState,
    restData: state.mock.rest
  };
};

const mapDispatchToProps = {
  fetchRest: mock.fetchRest
};

const AppConnecter = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default AppConnecter;
