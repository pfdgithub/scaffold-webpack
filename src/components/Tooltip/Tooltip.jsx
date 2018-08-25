import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/Tooltip.less';

const eventEnum = {
  onClick: 'onClick',
  onMouseEnter: 'onMouseEnter',
  onFocus: 'onFocus'
};

const positionEnum = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  topLeft: 'topLeft',
  topRight: 'topRight',
  bottomLeft: 'bottomLeft',
  bottomRight: 'bottomRight',
  leftTop: 'leftTop',
  leftBottom: 'leftBottom',
  rightTop: 'rightTop',
  rightBottom: 'rightBottom'
};

class Tooltip extends ComponentBase {
  static eventEnum = eventEnum
  static positionEnum = positionEnum

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.element,
    popupContent: PropTypes.node.isRequired,
    triggerEvent: (props, propName, componentName) => {
      let event = props[propName];
      if (!eventEnum[event]) {
        return new Error(
          'Invalid prop `' + propName + '` supplied to' +
          ' `' + componentName + '`. Validation failed.'
        );
      }
    },
    popupPosition: (props, propName, componentName) => {
      let event = props[propName];
      if (!positionEnum[event]) {
        return new Error(
          'Invalid prop `' + propName + '` supplied to' +
          ' `' + componentName + '`. Validation failed.'
        );
      }
    },

    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    maskClick: PropTypes.func
  }

  static defaultProps = {
    triggerEvent: eventEnum.onClick,
    popupPosition: positionEnum.right,

    mask: true,
    maskClosable: true,
    maskClick: null
  }

  constructor(props) {
    super(props);
    this.state = {
      showPopup: false
    };
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { className, children, popupContent, popupPosition, mask } = this.props;
    let { showPopup } = this.state;

    let tooltipClass = cls(stl.tooltip, {
      [className]: className
    });

    let content = [];
    if (showPopup) {
      if (mask) {
        content.push(
          <div key="mask" className={stl.mask} onClick={this.maskClickHandler}></div>
        );
      }

      let positionClass = styles[popupPosition];
      content.push(
        <div key="popup" className={cls(stl.popup, {
          [positionClass]: positionClass
        })} onClick={this.popupClickHandler}>
          <div className={stl.triangle}></div>
          <div className={stl.content}>{popupContent}</div>
        </div>
      );
    }

    return (
      <div className={tooltipClass} onClick={this.onClickHandler}
        onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler}
        onFocus={this.onFocusHandler} onBlur={this.onBlurHandler}>
        {content}
        {children}
      </div>
    );
  }

  maskClickHandler = (e) => {
    e.stopPropagation();
    let { maskClosable, maskClick } = this.props;

    if (maskClosable) {
      this.setState({
        showPopup: false
      });
      maskClick && maskClick();
    }
  }

  popupClickHandler = (e) => {
    e.stopPropagation();
    let { triggerEvent } = this.props;

    if (triggerEvent === eventEnum.onClick) {
      this.setState({
        showPopup: false
      });
    }
  }

  onClickHandler = () => {
    let { triggerEvent } = this.props;

    if (triggerEvent === eventEnum.onClick) {
      this.setState({
        showPopup: true
      });
    }
  }

  onMouseEnterHandler = () => {
    let { triggerEvent } = this.props;

    if (triggerEvent === eventEnum.onMouseEnter) {
      this.setState({
        showPopup: true
      });
    }
  }

  onMouseLeaveHandler = () => {
    let { triggerEvent } = this.props;

    if (triggerEvent === eventEnum.onMouseEnter) {
      this.setState({
        showPopup: false
      });
    }
  }

  onFocusHandler = () => {
    let { triggerEvent } = this.props;

    if (triggerEvent === eventEnum.onFocus) {
      this.setState({
        showPopup: true
      });
    }
  }

  onBlurHandler = () => {
    let { triggerEvent } = this.props;

    if (triggerEvent === eventEnum.onFocus) {
      this.setState({
        showPopup: false
      });
    }
  }
}

export default Tooltip;