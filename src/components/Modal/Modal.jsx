import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/Modal.less';

class Modal extends ComponentBase {
  static container = null; // 单例容器

  static init = (props, cb) => { // 初始化
    if (Modal.container === null) {
      Modal.container = document.createElement('div');
      document.body.appendChild(Modal.container);
      ReactDOM.render(<Modal {...props} />, Modal.container, cb);
    }
  }

  static destroy = () => { // 销毁
    if (Modal.container !== null) {
      ReactDOM.unmountComponentAtNode(Modal.container);
      Modal.container.parentNode.removeChild(Modal.container);
      Modal.container = null;
    }
  }

  static hide = () => {
    setTimeout(() => {
      Modal.destroy();
    }, 0);
  }

  static alert = (title, message, okClick) => {
    Modal.init({
      title: title,
      message: message,
      actions: [
        {
          text: '确定',
          onClick: okClick
        }
      ]
    });
  }

  static confirm = (title, message, okClick, cancelClick) => {
    Modal.init({
      title: title,
      message: message,
      actions: [
        {
          text: '取消',
          onClick: cancelClick
        },
        {
          text: '确定',
          onClick: okClick
        }
      ]
    });
  }

  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.node,
    message: PropTypes.node,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.node.isRequired,
        onClick: PropTypes.func
      })
    ).isRequired,
    actionDirection: PropTypes.oneOf(['horizontal', 'vertical']),

    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    maskClick: PropTypes.func
  }

  static defaultProps = {
    title: null,
    message: null,
    actions: [],
    actionDirection: 'horizontal',

    mask: true,
    maskClosable: true,
    maskClick: null
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
    let { className, title, message
      , actions, actionDirection, mask } = this.props;

    let modalClass = cls(stl.modal, {
      [className]: className
    });

    let actionClass = cls(stl.action, {
      [stl.horizontal]: actionDirection === 'horizontal',
      [stl.vertical]: actionDirection === 'vertical'
    });

    return (
      <div className={modalClass}>
        {
          !mask ? null : <div className={stl.mask}
            onClick={this.maskClickHandler}></div>
        }
        <div className={stl.container}>
          <div className={stl.content}>
            {
              !title ? null :
                <div className={stl.title}>
                  {title}
                </div>
            }
            {
              !message ? null :
                <div className={stl.message}>
                  {message}
                </div>
            }
          </div>
          <div className={stl.actions}>
            {
              actions.map((action, idx) => {
                return (
                  <a key={`action-${idx}`} className={actionClass} style={{
                    width: `${100 / actions.length}%`
                  }} onClick={this.actionClickHandler(action)}>
                    {action.text}
                  </a>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }

  actionClickHandler = (action) => {
    return (e) => {
      e.preventDefault();

      Modal.hide();
      action.onClick && action.onClick();
    };
  }

  maskClickHandler = () => {
    let { maskClosable, maskClick } = this.props;

    if (maskClosable) {
      Modal.hide();
      maskClick && maskClick();
    }
  }
}

export default Modal;