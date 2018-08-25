import React from 'react';

let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

class ReactBase extends React.Component {
  constructor(props) {
    super(props);

    // 在当前实例中添加数据，便于子类使用
    this.instanceData = {
      isUnmount: false, // 是否已卸载
      onWindowResize: null, // resize 事件回调
      onWindowScroll: null, // scroll 事件回调
      onDocumentVisibilitychange: null // visibilitychange 事件回调
    };
  }

  componentDidMount() {
    this.instanceData.isUnmount = false;
    if (this.instanceData.onWindowResize) {
      window.addEventListener('resize', this.instanceData.onWindowResize);
    }
    if (this.instanceData.onWindowScroll) {
      window.addEventListener('scroll', this.instanceData.onWindowScroll);
    }
    if (this.instanceData.onDocumentVisibilitychange) {
      document.addEventListener(visibilityChange, this.visibilityChangeHandler);
    }
  }

  componentWillUnmount() {
    this.instanceData.isUnmount = true;
    if (this.instanceData.onWindowResize) {
      window.removeEventListener('resize', this.instanceData.onWindowResize);
    }
    if (this.instanceData.onWindowScroll) {
      window.removeEventListener('scroll', this.instanceData.onWindowScroll);
    }
    if (this.instanceData.onDocumentVisibilitychange) {
      document.removeEventListener(visibilityChange, this.visibilityChangeHandler);
    }
  }

  visibilityChangeHandler = (e) => {
    let isHidden = document[hidden];

    if (this.instanceData.onDocumentVisibilitychange) {
      this.instanceData.onDocumentVisibilitychange(e, isHidden);
    }
  }

  // 卸载检测——未卸载才执行回调函数
  unmountCheck = (callback) => (
    (content) => {
      if (!this.instanceData.isUnmount) {
        callback(content);
      }
    }
  );
}

export default ReactBase;