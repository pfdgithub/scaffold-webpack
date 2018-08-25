import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/ToolBar.less';

class ToolBar extends ComponentBase {
  static propTypes = {
    toolBarClass: PropTypes.string,
    placeholderClass: PropTypes.string,
    containerClass: PropTypes.string,

    hideBackColor: PropTypes.bool,
    hideBorderTop: PropTypes.bool,
    hidePlaceholder: PropTypes.bool
  }

  static defaultProps = {
    hidePlaceholder: true
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { children, toolBarClass, placeholderClass, containerClass
      , hideBackColor, hideBorderTop, hidePlaceholder } = this.props;
    let itemArr = React.Children.toArray(children);

    let toolBarClassName = cls(stl.toolBar, {
      [toolBarClass]: toolBarClass
    });

    let placeholderClassName = cls(stl.placeholder, {
      [stl.hide]: hidePlaceholder,
      [placeholderClass]: placeholderClass
    });

    let containerClassName = cls(stl.container, {
      [stl.backColor]: !hideBackColor,
      [stl.borderTop]: !hideBorderTop,
      [containerClass]: containerClass
    });

    return (
      <div className={toolBarClassName}>
        {
          hidePlaceholder ? null :
            <div className={placeholderClassName}></div>
        }
        <div className={containerClassName}>
          <div className={stl.layoutContent}>
            {
              itemArr.map((item, idx) => {
                return (
                  <div key={`item-${idx}`} className={stl.itemContent} style={{
                    width: `${100 / itemArr.length}%`
                  }}>{item}</div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }

}

export default ToolBar;