import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/ActionSheet.less';

class ActionSheet extends ComponentBase {
  static container = null; // 单例容器

  static init = (props, cb) => { // 初始化
    if (ActionSheet.container === null) {
      ActionSheet.container = document.createElement('div');
      document.body.appendChild(ActionSheet.container);
      ReactDOM.render(<ActionSheet {...props} />, ActionSheet.container, cb);
    }
  }

  static destroy = () => { // 销毁
    if (ActionSheet.container !== null) {
      ReactDOM.unmountComponentAtNode(ActionSheet.container);
      ActionSheet.container.parentNode.removeChild(ActionSheet.container);
      ActionSheet.container = null;
    }
  }

  static hide = () => {
    setTimeout(() => {
      ActionSheet.destroy();
    }, 0);
  }

  static show = (title, actions) => {
    ActionSheet.init({
      title,
      actions: actions.concat([
        {
          text: '取消'
        }
      ])
    });
  }

  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.node.isRequired,
        onClick: PropTypes.func
      })
    ).isRequired,

    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    maskClick: PropTypes.func
  }

  static defaultProps = {
    title: '',
    actions: [],

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
    let { className, title, actions, mask } = this.props;

    let actionSheetClass = cls(stl.actionSheet, {
      [className]: className
    });

    return (
      <div className={actionSheetClass}>
        {
          !mask ? null : <div className={stl.mask}
            onClick={this.maskClickHandler}></div>
        }
        <div className={stl.container}>
          {!title ? null : <div className={stl.title}>{title}</div>}
          <div className={stl.actions}>
            {
              actions.map((action, idx) => {
                return (
                  <a className={stl.action} key={`action-${idx}`}
                    onClick={this.actionClickHandler(action)}>
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

      ActionSheet.hide();
      action.onClick && action.onClick();
    };
  }

  maskClickHandler = () => {
    let { maskClosable, maskClick } = this.props;

    if (maskClosable) {
      ActionSheet.hide();
      maskClick && maskClick();
    }
  }
}

export default ActionSheet;