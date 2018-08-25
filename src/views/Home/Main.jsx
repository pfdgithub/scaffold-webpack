import React from 'react';
// import cls from 'classnames';

import ViewBase from '../Common/ViewBase';
import stl from './styles/Main.less';

class Main extends ViewBase {
  constructor(props) {
    super(props);
    this.state = {
      tryTimes: 0
    };
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    let { tryTimes } = this.state;
    let { isLogined, account } = this.props;

    return (
      <div className={stl.main}>
        tryTimes: {tryTimes}
        <br />
        <br />
        isLogined: {JSON.stringify(isLogined)}
        <br />
        account: {JSON.stringify(account)}
        <br />
        <br />
        <a onClick={this.randomAccount}>试试手气</a>
      </div>
    );
  }

  randomAccount = () => {
    let { tryTimes } = this.state;
    let { fetchAccount } = this.props;

    fetchAccount(() => {
      this.setState({
        tryTimes: tryTimes + 1
      });
    });
  }

}

export default Main;
