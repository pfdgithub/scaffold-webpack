import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/SyncSubmit.less';

class SyncSubmit extends ComponentBase {
  static container = null; // 单例容器

  static init = (props, cb) => { // 初始化
    if (SyncSubmit.container === null) {
      SyncSubmit.container = document.createElement('div');
      document.body.appendChild(SyncSubmit.container);
      ReactDOM.render(<SyncSubmit {...props} />, SyncSubmit.container, cb);
    }
  }

  static destroy = () => { // 销毁
    if (SyncSubmit.container !== null) {
      ReactDOM.unmountComponentAtNode(SyncSubmit.container);
      SyncSubmit.container.parentNode.removeChild(SyncSubmit.container);
      SyncSubmit.container = null;
    }
  }

  static hide = () => {
    setTimeout(() => {
      SyncSubmit.destroy();
    }, 0);
  }

  static show = (props) => {
    SyncSubmit.init(props);
  }

  static propTypes = {
    className: PropTypes.string,
    method: PropTypes.oneOf(['GET', 'POST']).isRequired,
    target: PropTypes.oneOf(['_self', '_blank']).isRequired,
    action: PropTypes.string.isRequired,
    params: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired
  }

  static defaultProps = {
    method: 'POST',
    target: '_self'
  }

  refForm = React.createRef();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.refForm.current) {
      this.refForm.current.submit();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { className, method, target, action, params } = this.props;

    let formClass = cls(stl.syncSubmit, {
      [className]: className
    });

    return (
      <form className={formClass} ref={this.refForm}
        method={method} target={target} action={action}>
        {
          params.map((item) => {
            let { key, value } = item;
            return (
              <input key={key} type="hidden" name={key} value={value} />
            );
          })
        }
      </form>
    );
  }
}

export default SyncSubmit;
