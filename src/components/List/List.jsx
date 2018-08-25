import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { throttle } from 'commons/util';

import ComponentBase from '../Common/ComponentBase';
import stl from './styles/List.less';

class List extends ComponentBase {
  static propTypes = {
    listClass: PropTypes.string,
    loadingClass: PropTypes.string,
    noDataClass: PropTypes.string,
    noMoreClass: PropTypes.string,
    loadMoreClass: PropTypes.string,

    loadingContent: PropTypes.node,
    noDataContent: PropTypes.node,
    noMoreContent: PropTypes.node,
    loadMoreContent: PropTypes.node,

    autoLoadFirst: PropTypes.bool, // 自动加载第一页
    autoLoadMore: PropTypes.bool, // 自动加载下一页
    scrollOffset: PropTypes.number, // 滚轴偏移量
    throttleDelay: PropTypes.number, // 防抖周期
    loadMoreCb: PropTypes.func.isRequired, // 加载下一页回调函数
    paging: PropTypes.shape({ // 初始分页参数
      index: PropTypes.number.isRequired, // 当前页索引，初始化时应该是0，后续更新时应该是当前页数
      size: PropTypes.number.isRequired, // 分页大小
      count: PropTypes.number.isRequired // 总记录数
    }).isRequired,

    important: PropTypes.shape({ // 使用外部配置，覆盖内部状态
      isLoading: PropTypes.bool // 覆盖是否正在加载
    })
  }

  static defaultProps = {
    autoLoadFirst: false,
    autoLoadMore: false,
    scrollOffset: 200,
    throttleDelay: 100,
    paging: {
      index: 0,
      size: 10,
      count: 0
    }
  }

  static getDerivedStateFromProps(props, state) {
    // 页索引变更认为已加载结束
    if (props.paging.index !== state.prevIndex) {
      return {
        blockLoading: false,
        isLoading: false,
        prevIndex: props.paging.index
      };
    }

    return null;
  }

  throttleFn = null // 限制调用频率
  refLoadMore = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      blockLoading: false,
      isLoading: props.autoLoadFirst,
      prevIndex: props.paging.index
    };

    let { throttleDelay } = this.props;

    // throttleDelay 毫秒执行一次，计算是否进入可视区域
    this.throttleFn = throttle(throttleDelay, () => {
      let { autoLoadMore, scrollOffset } = this.props;

      if (autoLoadMore && this.refLoadMore.current) {
        let seeHeight = document.documentElement.clientHeight;
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let offsetTop = this.refLoadMore.current.offsetTop;

        if ((seeHeight + scrollTop + scrollOffset) >= offsetTop) {
          this.loadNextPage();
        }
      }
    });

    // 绑定滚动事件
    this.instanceData.onWindowScroll = () => {
      this.throttleFn(); // 触发计算
    };
  }

  componentDidMount() {
    super.componentDidMount();

    let { autoLoadFirst } = this.props;
    if (autoLoadFirst) { // 立即加载
      this.loadNextPage();
    }
    else {
      this.throttleFn(); // 触发计算
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentDidUpdate() {
    this.throttleFn(); // 触发计算
  }

  render() {
    let { important } = this.props;
    let { isLoading } = this.state;
    let { listClass, loadingClass, noDataClass, noMoreClass, loadMoreClass
      , loadingContent, noDataContent, noMoreContent, loadMoreContent
      , paging, children } = this.props;
    let pages = Math.ceil(paging.count / paging.size); // 总页数

    let listClassName = cls(stl.list, {
      [listClass]: listClass
    });
    let loadingClassName = cls(stl.loading, {
      [loadingClass]: loadingClass
    });
    let noDataClassName = cls(stl.noData, {
      [noDataClass]: noDataClass
    });
    let noMoreClassName = cls(stl.noMore, {
      [noMoreClass]: noMoreClass
    });
    let loadMoreClassName = cls(stl.loadMore, {
      [loadMoreClass]: loadMoreClass
    });

    loadingContent = loadingContent ? loadingContent : '';
    noDataContent = noDataContent ? noDataContent : '';
    noMoreContent = noMoreContent ? noMoreContent : '';
    loadMoreContent = loadMoreContent ? loadMoreContent : '';

    // 若存在外部配置，则忽略内部状态
    let finalIsLoading = false;
    if (important && typeof (important.isLoading) === 'boolean') {
      finalIsLoading = important.isLoading;
    }
    else {
      finalIsLoading = isLoading;
    }

    let stateCom = null;
    if (finalIsLoading) {
      stateCom = (
        <div className={loadingClassName}>{loadingContent}</div>
      );
    }
    else if (paging.count === 0) {
      stateCom = (
        <div className={noDataClassName}>{noDataContent}</div>
      );
    }
    else if (paging.index === pages) {
      stateCom = (
        <div className={noMoreClassName}>{noMoreContent}</div>
      );
    }
    else {
      stateCom = (
        <div className={loadMoreClassName}
          onClick={this.loadNextPage}
          ref={this.refLoadMore}>{loadMoreContent}</div>
      );
    }

    return (
      <div className={listClassName}>
        {children}
        {stateCom}
      </div>
    );
  }

  loadNextPage = () => {
    let { paging } = this.props;

    // 同时只允许发出一次请求
    if (!this.state.blockLoading) {
      // 异步生效，如果生效时间超过一个防抖周期，可能造成重复加载
      this.setState({
        blockLoading: true,
        isLoading: true
      });

      this.triggerLoadMore(paging.index + 1);
    }
  }

  triggerLoadMore = (index) => {
    let { loadMoreCb } = this.props;
    if (loadMoreCb) {
      // 加载指定分页
      loadMoreCb(index);
    }
  }
}

export default List;
