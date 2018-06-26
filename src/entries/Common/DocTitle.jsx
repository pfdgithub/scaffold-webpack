import React from 'react';
import PropTypes from 'prop-types';

// 修改页面标题——嵌套使用会以最外层组件为准
class DocTitle extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate() {
    this.updateTitle();
  }

  render() {
    const { children } = this.props;

    if (children) {
      return React.Children.only(children);
    } else {
      return null;
    }
  }

  updateTitle = () => {
    const { title } = this.props;

    if (title && title !== document.title) {
      document.title = title;
    }
  }
}

// 高阶组件包装 DocTitle
const createDocTitle = (title) => {
  return (Com) => {
    // 包装异步组件（绕过未命名警告）
    let WrappedDocTitle = (props) => {
      return (
        <DocTitle title={title}>
          <Com {...props} />
        </DocTitle>
      );
    };

    return WrappedDocTitle;
  };
};

export default DocTitle;
export {
  createDocTitle
};