import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/Countdown.less';

class Countdown extends ComponentBase {
  static propTypes = {
    className: PropTypes.string,
    timeSpan: PropTypes.number,  // 倒计时间隔
    autoTrigger: PropTypes.bool, // 自动触发一次点击
    disabled: PropTypes.bool, // 禁用按钮
    normalText: PropTypes.string, // 常规状态的文案
    lockedText: PropTypes.string, // 锁定状态的文案
    allowTrigger: PropTypes.func, // 是否允许触发 resolve(true)
    validClick: PropTypes.func, // 有效点击
    disabledClick: PropTypes.func // 禁用状态下的点击
  }

  static defaultProps = {
    timeSpan: 60,
    autoTrigger: false,
    disabled: false,
    normalText: '点击发送',
    lockedText: '重新发送'
  }

  timmer = null // 定时器

  constructor(props) {
    super(props);
    this.state = {
      locked: false, // 锁定
      second: 0 // 倒计时
    };
  }

  componentDidMount() {
    super.componentDidMount();

    let { autoTrigger } = this.props;
    if (autoTrigger) {
      this.run();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    clearTimeout(this.timmer);
  }

  render() {
    let { locked, second } = this.state;
    let { className, disabled, normalText, lockedText } = this.props;

    let countdownClass = cls(stl.countdown, {
      disabled: disabled,
      locked: locked,
      [className]: className
    });

    let text = locked ? `${lockedText}(${second})` : normalText;

    return (
      <a className={countdownClass} onClick={this.run}>{text}</a>
    );
  }

  run = (e) => {
    e && e.preventDefault();

    let { locked } = this.state;
    let { timeSpan, disabled, allowTrigger,
      validClick, disabledClick } = this.props;

    if (disabled) {
      disabledClick && disabledClick();
    }
    else if (!locked) {
      let p = Promise.resolve(true);

      if (allowTrigger) {
        p = p.then(() => {
          return allowTrigger();
        });
      }

      p.then((allow) => {
        if (allow) {
          this.checkLockAndRun(timeSpan);
          validClick && validClick();
        }
      }).catch((error) => {
        /* eslint-disable */
        console.error('Countdown', error);
        /* eslint-enable */
      });
    }
  }

  checkLockAndRun = (second) => {
    //如果倒计时还没结束
    if (second) {
      //设置倒计时时间和锁
      this.setState({
        locked: true,
        second: second
      });

      this.timmer = setTimeout(() => {
        this.checkLockAndRun(second - 1);
      }, 1000);
    } else {
      //如果倒计时结束，解锁
      this.setState({
        locked: false,
        second: 0
      });
    }
  }

}

export default Countdown;
