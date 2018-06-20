import db from 'sources/db.inner';

import { fetchPending, fetchFulfilled, fetchRejected } from '../global/actions';

// 传统风格接口
export const FETCH_LEGACY = 'FETCH_LEGACY';
export const fetchLegacy = () => {
  return (dispatch) => {
    let url = db.legacy.state.config.url;
    let param = {
      clientTime: Date.now()
    };

    // 请求开始
    dispatch(fetchPending(url, param));

    db.legacy.state(param).then((content) => {
      // 请求成功
      dispatch(fetchFulfilled(content.data));

      dispatch({
        type: FETCH_LEGACY,
        payload: content.data
      });
    }).catch((error) => {
      // 请求失败
      dispatch(fetchRejected(error.message));
    });
  };
};

// REST 风格接口
export const FETCH_REST = 'FETCH_REST';
export const fetchRest = () => {
  return (dispatch) => {
    let url = db.rest.state.config.url;
    let param = {
      ':state': 123,
      clientTime: Date.now()
    };

    // 请求开始
    dispatch(fetchPending(url, param));

    db.rest.state(param).then((content) => {
      // 请求成功
      dispatch(fetchFulfilled(content.data));

      dispatch({
        type: FETCH_REST,
        payload: content.data
      });
    }).catch((error) => {
      // 请求失败
      dispatch(fetchRejected(error.message));
    });
  };
};

