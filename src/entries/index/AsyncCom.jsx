import React from 'react';
import PropTypes from 'prop-types';

class AsyncCom extends React.Component {
  static propTypes = {
    getCom: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      component: null,
      error: null
    };
  }

  componentDidMount() {
    this.loadCom(this.props.getCom);
  }

  render() {
    /* eslint-disable */
    let { getCom, ...passProps } = this.props;
    /* eslint-enable */

    let Com = this.state.component;
    let placeholder = this.getPlaceholder();

    return (
      Com ? <Com {...passProps} /> : placeholder
    );
  }

  // 加载中或加载失败时的占位符
  getPlaceholder() {
    if (this.state.error) {
      // 加载失败
      return (
        <span>
          {this.state.error.stack || this.state.error}
        </span>
      );
    }
    else {
      // 加载中
      return (
        <span>
          loading...
        </span>
      );
    }
  }

  // 加载组件
  loadCom(getCom) {
    getCom((component) => {
      // 加载成功
      this.setState({
        component: component.default || component
      });
    }, (error) => {
      // 加载失败
      this.setState({
        error: error ? error : '未知错误'
      });
    });
  }
}

// 传入 import 函数，获取异步组件
const getAsyncCom = (importFun) => {
  // 包装异步组件（绕过未命名警告）
  let WrappedAsyncCom = (props) => {
    // 组件加载函数
    let getComFun = (componentCb, errorCb) => {
      // 执行 import 函数
      let importPromise = importFun();
      return importPromise.then(componentCb).catch(errorCb);
    };

    return (
      <AsyncCom {...props} getCom={getComFun} />
    );
  };

  return WrappedAsyncCom;
};

export default AsyncCom;
export {
  getAsyncCom
};
