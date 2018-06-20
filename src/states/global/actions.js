// 请求开始
export const FETCH_PENDING = 'FETCH_PENDING';
export const fetchPending = (url, param) => {
  return {
    type: FETCH_PENDING,
    payload: {
      url,
      param
    }
  };
};

// 请求成功
export const FETCH_FULFILLED = 'FETCH_FULFILLED';
export const fetchFulfilled = (data) => {
  return {
    type: FETCH_FULFILLED,
    payload: data
  };
};

// 请求失败
export const FETCH_REJECTED = 'FETCH_REJECTED';
export const fetchRejected = (error) => {
  return {
    type: FETCH_REJECTED,
    payload: error
  };
};
