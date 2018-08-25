import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { throttle } from 'commons/util';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/Sticky.less';

// 原生支持 sticky
let supperSticky = window.CSS && window.CSS.supports
  && window.CSS.supports('position', 'sticky');

class Sticky extends ComponentBase {
  static propTypes = {
    stickyClass: PropTypes.string,
    placeholderClass: PropTypes.string,
    containerClass: PropTypes.string,

    children: PropTypes.node,
    top: PropTypes.number,
    throttleDelay: PropTypes.number
  }

  static defaultProps = {
    top: 0,
    throttleDelay: 100
  }

  throttleFn = null // 限制调用频率
  refPlaceholder = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isSticky: false
    };

    // 不再监听滚动事件
    if (!supperSticky) {
      let { throttleDelay } = this.props;

      // throttleDelay 毫秒执行一次，计算是否进入可视区域
      this.throttleFn = throttle(throttleDelay, () => {
        let { top } = this.props;

        if (this.refPlaceholder.current) {
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          let offsetTop = this.refPlaceholder.current.offsetTop;

          this.setState({
            isSticky: (scrollTop + top) >= offsetTop
          });
        }
      });

      // 绑定滚动事件
      this.instanceData.onWindowScroll = () => {
        this.throttleFn(); // 触发计算
      };
    }
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { stickyClass, placeholderClass, containerClass
      , children, top } = this.props;
    let { isSticky } = this.state;

    let stickyClassName = cls(stl.sticky, {
      [stickyClass]: stickyClass
    });

    let placeholderClassName = cls(stl.placeholder, {
      [placeholderClass]: placeholderClass
    });

    let containerClassName = cls(stl.container, {
      [containerClass]: containerClass
    });

    let placeholderStyle = {};
    let containerStyle = {};

    if (supperSticky) {
      // 原生 sticky 配置
      containerStyle.position = 'sticky';
      containerStyle.top = `${top}px`;
    }
    else {
      if (isSticky) {
        // 模拟 sticky 配置
        containerStyle.position = 'fixed';
        containerStyle.top = `${top}px`;
      }
      else {
        // 不需要占位容器
        placeholderStyle.height = '0px';
      }
    }

    return (
      supperSticky
        ? (
          <div className={containerClassName} style={containerStyle}>
            {children}
          </div>
        )
        : (
          <div className={stickyClassName}>
            <div className={placeholderClassName} style={placeholderStyle}
              ref={this.refPlaceholder}></div>
            <div className={containerClassName} style={containerStyle}>
              {children}
            </div>
          </div>
        )
    );
  }
}

export default Sticky;
