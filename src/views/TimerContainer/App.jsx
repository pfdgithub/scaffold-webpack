import React from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';

import ViewBase from '../Common/ViewBase';
import style from './styles/App.less';
import Timer from 'components/Timer';

// 单例容器
let _container = null;

class App extends ViewBase {
  static init = (props) => { // 初始化
    if (_container === null) {
      _container = document.createElement('div');
      document.body.appendChild(_container);
      ReactDOM.render(<App {...props} />, _container);
    }
  }

  static destroy = () => { // 销毁
    if (_container !== null) {
      ReactDOM.unmountComponentAtNode(_container);
      _container.parentNode.removeChild(_container);
      _container = null;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      windowInnerWidth: 0,
      windowInnerHeight: 0
    };

    this.instanceData.onWindowResize = () => {
      this.setState({
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight
      });
    };
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    return (
      <div className={cls(style.app)}>
        <Timer/>
        <br/>
        <span>调整窗口监听宽高</span>
        <br/>
        {`${this.state.windowInnerWidth} ${this.state.windowInnerHeight}`}
        <br/>
        <span onClick={this.destroyApp}>点击此处销毁视图</span>
      </div>
    );
  }

  destroyApp = () => {
    setTimeout(() => {
      App.destroy();
    }, 0);
  }
}

export default App;