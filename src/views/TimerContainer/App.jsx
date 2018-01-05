import React from 'react';
import cls from 'classnames';

import ViewBase from '../Common/ViewBase';
import style from './styles/App.less';
import Timer from 'components/Timer';

class App extends ViewBase {
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
        <span>时间组件</span>
        <br />
        <Timer />
        <br />
        <br />
        <span>监听窗口宽高</span>
        <br />
        {`${this.state.windowInnerWidth} ${this.state.windowInnerHeight}`}
        <br />
        <br />
      </div>
    );
  }
}

export default App;