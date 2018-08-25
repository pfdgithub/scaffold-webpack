import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/Captcha.less';

class Captcha extends ComponentBase {
  static propTypes = {
    className: PropTypes.string,
    captchaSrc: PropTypes.string.isRequired,
    captchaChange: PropTypes.func
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      src: props.captchaSrc
    };
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { src } = this.state;
    let { className } = this.props;

    let captchaClass = cls(stl.captcha, {
      [className]: className
    });

    return (
      <img className={captchaClass} alt={'点击更新验证码'} src={src} onClick={this.updateCaptcha} />
    );
  }

  updateCaptcha = () => {
    let { captchaSrc, captchaChange } = this.props;

    this.setState({
      src: `${captchaSrc}?_=${Date.now()}`
    }, () => {
      captchaChange && captchaChange();
    });
  }
}

export default Captcha;
