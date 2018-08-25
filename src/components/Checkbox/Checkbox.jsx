import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/Checkbox.less';

/**
 * 使用 label 包裹 checkbox 会造成 click 事件重复触发，故阻止冒泡。
 * 详见 http://blog.codemonkey.cn/archives/379
 */
class Checkbox extends ComponentBase {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    onClick: PropTypes.func,
    onChange: PropTypes.func
  }

  static defaultProps = {
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
    let { className, name, disabled, checked, defaultChecked } = this.props;

    let checkboxClass = cls(stl.checkbox, {
      [className]: className
    });

    return (
      <label className={checkboxClass} onClick={this.labelClickHandler}>
        <input type="checkbox" className={stl.input}
          name={name} disabled={disabled} checked={checked} defaultChecked={defaultChecked}
          onClick={this.inputClickHandler} onChange={this.inputChangeHandler} />
        <span className={stl.cover}></span>
      </label>
    );
  }

  labelClickHandler = (e) => {
    e.stopPropagation();
  }

  inputClickHandler = (e) => {
    let { onClick } = this.props;

    onClick && onClick(e);
  }

  inputChangeHandler = (e) => {
    let { onChange } = this.props;

    onChange && onChange(e);
  }

}

export default Checkbox;
