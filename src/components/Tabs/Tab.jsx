import React from 'react';
import PropTypes from 'prop-types';

import ComponentBase from '../Common/ComponentBase';

class Tab extends ComponentBase {
  static propTypes = {
    barClass: PropTypes.string,
    panelClass: PropTypes.string,

    state: PropTypes.any,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
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
      <div></div>
    );
  }
}

export default Tab;