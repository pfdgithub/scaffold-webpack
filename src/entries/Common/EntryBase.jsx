import ReactBase from 'commons/ReactBase';
import util from 'commons/util';
import config from 'commons/config';

class EntryBase extends ReactBase {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  // 兼容单页路由的参数解析
  parseUrlParam = () => {
    let { history } = this.props;
    let param = {};

    if (history) { // 单页——解析路由
      param.query = util.parseQueryString(history.location.search);
      param.hash = util.parseHashString(history.location.hash);
    }
    else { // 多页——解析页面
      param.query = util.parseQueryString();
      param.hash = util.parseHashString();
    }

    return param;
  }

  // 兼容单页路由的页面跳转
  gotoPage = (url, query, hash) => {
    let { history } = this.props;

    if (history) { // 单页——路由跳转
      let pathname = url.replace(config.public.pagePath, '/'); // 移除路径前缀
      history.push({
        pathname: pathname,
        search: util.joinQueryString(query),
        hash: util.joinHashString(hash)
      });
    }
    else { // 多页——页面跳转
      util.gotoPage(url, query, hash);
    }
  }

  // 兼容单页路由的页面回退
  backPage = () => {
    let { history } = this.props;

    if (history) { // 单页——路由回退
      history.goBack();
    }
    else { // 多页——页面回退
      util.backPage();
    }
  }
}

export default EntryBase;