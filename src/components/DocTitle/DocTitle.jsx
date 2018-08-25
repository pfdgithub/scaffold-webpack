import React from 'react';
import PropTypes from 'prop-types';
// import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
// import stl from './styles/DocTitle.less';

class DocTitle extends ComponentBase {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node
  }

  static defaultProps = {
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
    const { children } = this.props;

    this.updateTitle();

    return children;
  }

  updateTitle = () => {
    const { title } = this.props;

    if (title && title !== document.title) {
      document.title = title;
    }
  }
}

export default DocTitle;

// 高阶组件包装 DocTitle
export const createDocTitle = (title) => {
  return (Com) => {
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
