import React from 'react';
import classnames from 'classnames';

import EntryBase from '../Common/EntryBase';
import styles from './styles/App.less';
import logo from './images/logo.png';
import db from 'sources/db.inner';

class App extends EntryBase {
  constructor(props) {
    super(props);
    this.state = {
      legacy: {},
      rest: {}
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
      <div className={classnames(styles.app)}>
        <img src={logo} />
        <br />
        <br />
        <a onClick={this.getLegacyData}>传统风格接口</a>
        <br />
        {JSON.stringify(this.state.legacy)}
        <br />
        <br />
        <a onClick={this.getRestData}>REST 风格接口</a>
        <br />
        {JSON.stringify(this.state.rest)}
        <br />
        <br />
        <a onClick={this.loadView}>加载视图</a>
        <br />
        <a onClick={this.unloadView}>卸载视图</a>
        <br />
        <br />
      </div>
    );
  }

  // 传统风格接口
  getLegacyData = () => {
    db.legacy.state({
      clientTime: Date.now()
    }).then(this.unmountCheck((content) => {
      this.setState({
        legacy: content.data
      });
    })).catch(this.unmountCheck((error) => {
      alert(error.message);
    }));
  }

  // REST 风格接口
  getRestData = () => {
    db.rest.state({
      ':state': 123,
      clientTime: Date.now()
    }).then(this.unmountCheck((content) => {
      this.setState({
        rest: content.data
      });
    })).catch(this.unmountCheck((error) => {
      alert(error.message);
    }));
  }

  // 加载视图
  loadView = () => {
    import(/* webpackChunkName: "chunk-TimerContainer" */ 'views/TimerContainer')
      .then((view) => {
        this.replaceView(view);

        if (module.hot) {
          module.hot.accept('views/TimerContainer', () => {
            import(/* webpackChunkName: "chunk-TimerContainer" */ 'views/TimerContainer')
              .then((view) => {
                this.replaceView(view);
              });
          });
        }
      });
  }

  // 卸载视图
  unloadView = () => {
    this.replaceView(null);
  }

  // 替换视图
  activeView = null;
  replaceView = (newView) => {
    // 销毁原视图
    this.activeView && this.activeView.destroy();
    // 更新新视图
    this.activeView = newView && (newView.default || newView);
    // 初始化新视图
    this.activeView && this.activeView.init();
  };

}

export default App;