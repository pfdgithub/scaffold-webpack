import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import TabBar from './TabBar';
import TabPanel from './TabPanel';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/Tabs.less';

class Tabs extends ComponentBase {
  static propTypes = {
    tabsClass: PropTypes.string,
    tabBarClass: PropTypes.string,
    tabPanelClass: PropTypes.string,

    defaultActiveIndex: PropTypes.number,
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: (typeof (props.defaultActiveIndex) === 'number'
        && props.defaultActiveIndex > 0) ? props.defaultActiveIndex : 0
    };
  }

  componentDidMount() {
    super.componentDidMount();

    this.triggerTabBarClick(this.state.activeIndex); // 触发默认激活选项卡
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { children, tabsClass, tabBarClass, tabPanelClass } = this.props;
    let tabArr = React.Children.toArray(children); // 从 Tab 中提取 TabBar 和 TabPanel

    let tabsClassName = cls(stl.tabs, {
      [tabsClass]: tabsClass
    });

    let tabBarClassName = cls(stl.tabBar, {
      [tabBarClass]: tabBarClass
    });

    let tabPanelClassName = cls(stl.tabPanel, {
      [tabPanelClass]: tabPanelClass
    });

    return (
      <div className={tabsClassName}>
        <div className={tabBarClassName}>
          {
            tabArr.map((tab, idx) => {
              let { barClass, state, title } = tab.props;
              let active = this.state.activeIndex === idx;
              return (
                <TabBar key={`tabBar-${idx}`} className={barClass} active={active}
                  onClick={this.tabBarClickHandler(idx, state)}>
                  {title}
                </TabBar>
              );
            })
          }
        </div>
        <div className={tabPanelClassName}>
          {
            tabArr.map((tab, idx) => {
              let { panelClass, children } = tab.props;
              let active = this.state.activeIndex === idx;
              return (
                <TabPanel key={`tabPanel-${idx}`} className={panelClass} active={active}>
                  {children}
                </TabPanel>
              );
            })
          }
        </div>
      </div>
    );
  }

  triggerTabBarClick = (index) => {
    let { children } = this.props;
    let tabArr = React.Children.toArray(children);
    let tab = tabArr[index];
    if (tab) {
      let { onChange } = this.props;
      let { state } = tab.props;
      onChange && onChange(state);
    }
  }

  tabBarClickHandler = (index, state) => {
    return () => {
      this.setState({
        activeIndex: index
      });

      let { onChange } = this.props;
      onChange && onChange(state);
    };
  };
}

export default Tabs;