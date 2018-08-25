import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/TabPanel.less';

class TabPanel extends ComponentBase {
  static propTypes = {
    className: PropTypes.string,
    active: PropTypes.bool.isRequired,
    children: PropTypes.node
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
    let { className, children, active } = this.props;

    let panelClass = cls(stl.panel, {
      active: active,
      [className]: className
    });

    return (
      <div className={panelClass}>
        {children}
      </div>
    );
  }
}

export default TabPanel;