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

  static addNotice = (type, content, options) => {
    let {
      delay, // 延时显示（秒）
      duration, // 持续时间（秒）
      mask, // 开启遮蔽罩
      single, // 只显示每个 (type+content) 中 (delay+duration) 最长的那个实例，其他隐藏
      onClose // 关闭回调
    } = (options || {});

    // 设置默认默认参数值
    if (typeof (content) === 'undefined') {
      content = '';
    }
    if (typeof (delay) === 'undefined') {
      delay = 0;
    }
    if (typeof (duration) === 'undefined') {
      duration = 3;
    }
    if (typeof (mask) === 'undefined') {
      mask = false;
    }

    // 初始化 notice
    let notice = {
      _idx: Toast.noticeCounter++,
      _timmer: 0,
      _type: type,
      _content: content,
      _options: {
        delay,
        duration,
        mask,
        single,
        onClose
      },
      hide: () => { }
    };

    // 隐藏 notice
    notice.hide = () => {
      clearTimeout(notice._timmer); // 清理定时器
      notice._options.onClose && notice._options.onClose(); // 触发回调

      Toast.removeNotice(notice); // 移除实例
    };

    // 持续显示后隐藏 notice
    if (notice._options.duration > 0) {
      // 延时 (delay+duration) 后隐藏
      notice._timmer = setTimeout(
        notice.hide,
        1000 * (notice._options.duration +
          (notice._options.delay > 0 ? notice._options.delay : 0)
        )
      );
    }

    // 显示 notice
    let show = () => {
      // 第一次添加 notice ，初始化组件
      if (!Toast.container) {
        Toast.init();
      }

      // 触发组件更新
      Toast.forceUpdate();
    };

    // 延时或立即显示 notice
    setTimeout(
      show,
      1000 * (notice._options.delay > 0 ? notice._options.delay : 0)
    );

    // 添加 notice
    Toast.noticeList = Toast.noticeList.concat(notice);

    return notice;
  }

  static removeNotice = (notice) => {
    // 移除当前 notice
    Toast.noticeList = Toast.noticeList.filter((item) => {
      return item !== notice;
    });

    // 触发组件更新
    Toast.forceUpdate();

    // 全部 notice 已移除，销毁
    if (Toast.noticeList.length === 0) {
      Toast.destroy();
    }
  }

  static loading = (content, options) => {
    return Toast.addNotice('loading', content, Object.assign({
      delay: 200,
      duration: 0,
      mask: true,
      single: true
    }, options));
  }

  static info = (content, options) => {
    return Toast.addNotice('info', content, options);
  }

  static success = (content, options) => {
    return Toast.addNotice('success', content, options);
  }

  static fail = (content, options) => {
    return Toast.addNotice('fail', content, options);
  }

  static offline = (content, options) => {
    return Toast.addNotice('offline', content, options);
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

    let { mask, list } = this.filterNotices();

    return (
      <div className={toastClass}>
        {
          !mask ? null :
            <div className={stl.mask}></div>
        }
        <div className={stl.containers}>
          {
            list.map((item) => {
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

  filterNotices = () => {
    let lastMask = false;
    let singleNoticeObj = {};
    let singleNoticeList = [];
    let multiNoticeList = [];

    // 遍历待显示 notice 数组
    Toast.noticeList.forEach((notice) => {
      let { _idx, _type, _content, _options } = notice;
      let { delay, duration, mask, single } = _options;

      // 遮蔽罩是唯一的，有任意 notice 需要就显示
      lastMask = lastMask || mask;

      if (single) {
        // 如果启用 single 则只显示每个 (type+content) 中 (delay+duration) 最长的那个实例
        let singleKey = `${_type}-${_content}`;
        let singleNotice = singleNoticeObj[singleKey];
        if (singleNotice) {
          // 已存在，对比后保留 (delay+duration) 最长的那个
          let s_delay = singleNotice._options.delay;
          let s_duration = singleNotice._options.duration;

          if ((delay + duration) >= (s_delay + s_duration)) {
            // 替换为当前 notice
            singleNoticeObj[singleKey] = notice;
          }
        }
        else {
          // 还不存在，保存当前 notice
          singleNoticeObj[singleKey] = notice;
        }
      }
      else {
        // 未启用 single 则直接显示
        multiNoticeList.push({
          idx: _idx,
          type: _type,
          content: _content
        });
      }
    });

    // 遍历启用 single 的通知
    for (let type in singleNoticeObj) {
      let singleNotice = singleNoticeObj[type];
      let { _idx, _type, _content } = singleNotice;

      singleNoticeList.push({
        idx: _idx,
        type: _type,
        content: _content
      });
    }

    return {
      mask: lastMask,
      list: [].concat(singleNoticeList, multiNoticeList)
    };
  }

}

export default Toast;