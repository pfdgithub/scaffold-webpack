import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cls from 'classnames';
import Icon from 'components/Icon';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/Toast.less';
import success from './images/success.svg';
import fail from './images/fail.svg';
import dislike from './images/dislike.svg';

class Toast extends ComponentBase {
  static container = null; // 单例容器
  static refToast = React.createRef(); // Toast 实例

  static noticeCounter = 0; // 通知计数器
  static noticeList = []; // 通知列表

  static init = (props, cb) => { // 初始化
    if (Toast.container === null) {
      Toast.container = document.createElement('div');
      document.body.appendChild(Toast.container);
      ReactDOM.render(<Toast {...props} ref={Toast.refToast} />, Toast.container, cb);
    }
  }

  static destroy = () => { // 销毁
    if (Toast.container !== null) {
      ReactDOM.unmountComponentAtNode(Toast.container);
      Toast.container.parentNode.removeChild(Toast.container);
      Toast.container = null;
      Toast.refToast = React.createRef();

      Toast.noticeCounter = 0;
      Toast.noticeList = [];
    }
  }

  static forceUpdate = () => {
    if (Toast.refToast.current) {
      Toast.refToast.current.forceUpdate();
    }
  }

  static addNotice = (type, content, duration, onClose, mask) => {
    if (typeof (duration) === 'undefined') {
      duration = 3;
    }
    if (typeof (mask) === 'undefined') {
      mask = false;
    }

    // 初始化 notice
    let notice = {
      idx: Toast.noticeCounter++,
      type,
      content,
      duration,
      onClose,
      mask
    };

    // 隐藏 notice
    notice.hide = () => {
      clearTimeout(notice.timmer);
      notice.onClose && notice.onClose();

      Toast.removeNotice(notice);
    };

    // 延时隐藏 notice
    if (notice.duration > 0) {
      notice.timmer = setTimeout(notice.hide, notice.duration * 1000);
    }

    // 添加当前 notice
    Toast.noticeList = Toast.noticeList.concat(notice);

    // 第一次添加 notice ，初始化
    if (Toast.noticeList.length === 1) {
      Toast.init();
    }
    Toast.forceUpdate();

    return notice;
  }

  static removeNotice = (notice) => {
    // 移除当前 notice
    Toast.noticeList = Toast.noticeList.filter((item) => {
      return item !== notice;
    });
    Toast.forceUpdate();

    // 全部 notice 已移除，销毁
    if (Toast.noticeList.length === 0) {
      Toast.destroy();
    }
  }

  static info = (content, duration, onClose, mask) => {
    return Toast.addNotice('info', content, duration, onClose, mask);
  }

  static loading = (content, duration, onClose, mask) => {
    // 加载中默认使用遮蔽罩
    mask = typeof (mask) === 'undefined' ? true : mask;
    return Toast.addNotice('loading', content, duration, onClose, mask);
  }

  static success = (content, duration, onClose, mask) => {
    return Toast.addNotice('success', content, duration, onClose, mask);
  }

  static fail = (content, duration, onClose, mask) => {
    return Toast.addNotice('fail', content, duration, onClose, mask);
  }

  static offline = (content, duration, onClose, mask) => {
    return Toast.addNotice('offline', content, duration, onClose, mask);
  }

  static propTypes = {
    className: PropTypes.string
  }

  static defaultProps = {
  }

  typeIcon = {
    info: '',
    loading: 'loading',
    success: success,
    fail: fail,
    offline: dislike
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
    let { className } = this.props;

    let toastClass = cls(stl.toast, {
      [className]: className
    });

    // 遮蔽罩是唯一的，有任意 notice 需要就显示
    let mask = Toast.noticeList.find((item) => {
      return item.mask;
    });

    return (
      <div className={toastClass}>
        {
          !mask ? null :
            <div className={stl.mask}></div>
        }
        <div className={stl.containers}>
          {
            Toast.noticeList.map((item) => {
              let { idx, type, content } = item;
              let icon = this.typeIcon[type];
              icon = typeof (icon) === 'undefined' ? type : icon;

              return (
                <div key={`notice-${idx}`} className={stl.container}>
                  <div className={stl.content}>
                    {
                      !icon ? null :
                        <Icon className={stl.icon} type={icon} />
                    }
                    {
                      !content ? null :
                        <div className={stl.text}>{content}</div>
                    }
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

}

export default Toast;