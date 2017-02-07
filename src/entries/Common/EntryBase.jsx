import React from 'react';

/**
 * ES6 有一个特别规定，就是通过super调用父类的方法时，super会绑定子类的this。
 * http://es6.ruanyifeng.com/#docs/class#super-关键字
 */
class EntryBase extends React.Component {
  constructor(props) {
    super(props);
    
    // 在当前实例中添加数据，便于子类使用
    this.instanceData = {
      isUnmount: false, // 是否已卸载
      onWindowResize: null // window.onresize 事件回调
    };
  }

  componentDidMount() {
    this.instanceData.isUnmount = false;
    if (this.instanceData.onWindowResize) {
      window.addEventListener('resize', this.instanceData.onWindowResize);
    }
  }

  componentWillUnmount() {
    this.instanceData.isUnmount = true;
    if (this.instanceData.onWindowResize) {
      window.removeEventListener('resize', this.instanceData.onWindowResize);
    }
  }

  // 卸载检测——未卸载才执行回调函数
  unmountCheck(callback) {
    return (content) => {
      if (!this.instanceData.isUnmount) {
        callback(content);
      }
    };
  }
}

export default EntryBase;