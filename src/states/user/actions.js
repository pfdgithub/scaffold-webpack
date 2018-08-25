// 更新账户信息
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const updateAccount = (account) => {
  return {
    type: UPDATE_ACCOUNT,
    payload: account
  };
};

// 获取用户信息
export const fetchAccount = (cb) => {
  return (dispatch/* , getState */) => {
    setTimeout(() => {
      let state;
      if (Math.random() >= 0.5) {
        state = {
          mobile: '12345678901',
          userName: '张三'
        };
      }

      dispatch(updateAccount(state));
      cb && cb(state);
    }, 1000);
  };
};
