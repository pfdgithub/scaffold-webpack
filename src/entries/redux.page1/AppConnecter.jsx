import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mock } from 'states/actions';

import App from './App';

const mapStateToProps = (state) => {
  return {
    fetchState: state.global.fetchState,
    legacyData: state.mock.legacy
  };
};

const mapDispatchToProps = {
  fetchLegacy: mock.fetchLegacy
};

const AppConnecter = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default AppConnecter;
