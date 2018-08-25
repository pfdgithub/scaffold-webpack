import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/TabBar.less';

class TabBar extends ComponentBase {
  static propTypes = {
    className: PropTypes.string,
    active: PropTypes.bool.isRequired,
    children: PropTypes.node,
    onClick: PropTypes.func
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

    let barClass = cls(stl.bar, {
      active: active,
      [className]: className
    });

    return (
      <div className={barClass} onClick={this.tabBarClickHandler}>
        {children}
      </div>
    );
  }

  tabBarClickHandler = () => {
    let { onClick } = this.props;
    onClick && onClick();
  }
}

export default TabBar;