import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { backPage } from 'commons/util';
import Icon from 'components/Icon';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/NavBar.less';
import backArrow from './images/backArrow.svg';

class NavBar extends ComponentBase {
  static domHeight = 129; // 根据 Less 中的 @shimHeight 和 @navBarHeight

  static propTypes = {
    navBarClass: PropTypes.string,
    placeholderClass: PropTypes.string,
    containerClass: PropTypes.string,

    hideShim: PropTypes.bool,
    hideBackColor: PropTypes.bool,
    hideBorderBottom: PropTypes.bool,
    hidePlaceholder: PropTypes.bool,

    title: PropTypes.node,
    leftContent: PropTypes.node,
    rightContent: PropTypes.node,
    backClick: PropTypes.func
  }

  static defaultProps = {
    hideShim: true,
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
    let { navBarClass, placeholderClass, containerClass
      , hideShim, hideBackColor, hideBorderBottom, hidePlaceholder
      , title, leftContent, rightContent } = this.props;

    let navBarClassName = cls(stl.navBar, {
      [navBarClass]: navBarClass
    });

    let placeholderClassName = cls(stl.placeholder, {
      [stl.hide]: hidePlaceholder,
      [placeholderClass]: placeholderClass
    });

    let containerClassName = cls(stl.container, {
      [stl.backColor]: !hideBackColor,
      [stl.borderBottom]: !hideBorderBottom,
      [containerClass]: containerClass
    });

    return (
      <div className={navBarClassName}>
        {
          hideShim ? null :
            <div className={stl.shim}></div>
        }
        {
          hidePlaceholder ? null :
            <div className={placeholderClassName}></div>
        }
        <div className={containerClassName}>
          {
            hideShim ? null :
              <div className={stl.shim}></div>
          }
          <div className={stl.layoutContent}>
            <div className={stl.leftContent}>
              {
                leftContent ? leftContent :
                  <Icon type={backArrow} className={stl.backIcon} onClick={this.backClickHandler} />
              }
            </div>
            <div className={stl.title}>
              {
                title ? title : null
              }
            </div>
            <div className={stl.rightContent}>
              {
                rightContent ? rightContent : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  backClickHandler = () => {
    let { backClick } = this.props;
    if (backClick) {
      backClick();
    }
    else {
      backPage();
    }
  }
}

export default NavBar;