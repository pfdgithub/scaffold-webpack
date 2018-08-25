import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/Icon.less';
import loading from './images/loading.svg';

class Icon extends ComponentBase {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOfType([
      PropTypes.oneOf(['loading']),
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ])
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { className, type, ...restProps } = this.props;

    let isLoading = type === 'loading';
    let iconClass = cls(stl.icon, {
      [stl.loading]: isLoading, // 载入动画
      [className]: className
    });
    let id = isLoading ? loading.id : type.id;

    return (
      <svg className={iconClass} {...restProps}>
        <use xlinkHref={`#${id}`} />
      </svg>
    );
  }
}

export default Icon;
