import React from 'react';
// import cls from 'classnames';
import { FormattedMessage } from 'react-intl';
import { getLocale, setLocale } from 'commons/locale';

import ViewBase from '../Common/ViewBase';
import stl from './styles/Main.less';

class Main extends ViewBase {
  constructor(props) {
    super(props);
    this.state = {
      resolveTimes: 0
    };
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { resolveTimes } = this.state;
    let { isLogined, account } = this.props;

    return (
      <div className={stl.main}>
        <FormattedMessage defaultMessage="成功次数" />
        :{resolveTimes}
        <br />
        <br />
        <FormattedMessage defaultMessage="是否登陆" />
        :{JSON.stringify(isLogined)}
        <br />
        <FormattedMessage defaultMessage="账户信息" />
        :{JSON.stringify(account)}
        <br />
        <br />
        <a onClick={this.randomAccount}>
          <FormattedMessage defaultMessage="试试手气" />
        </a>
        <br />
        <br />
        <a onClick={this.changeLocale}>
          <FormattedMessage id="I have an ID" defaultMessage="切换区域" />
        </a>

      </div>
    );
  }

  randomAccount = () => {
    let { resolveTimes } = this.state;
    let { fetchAccount } = this.props;

    fetchAccount(() => {
      this.setState({
        resolveTimes: resolveTimes + 1
      });
    });
  }

  changeLocale = () => {
    let locale = getLocale();
    let parentLocale = locale.split('-')[0];

    if (parentLocale === 'zh') {
      setLocale('en');
    }
    else {
      setLocale('zh');
    }

    location.reload();
  };

}

export default Main;
