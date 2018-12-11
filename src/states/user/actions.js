// 更新账户信息
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const updateAccount = (account) => {
  return {
    type: UPDATE_ACCOUNT,
    payload: account
  };
};

// 获取用户信息
export const fetchAccount = (resolve, reject) => {
  return (dispatch/* , getState */) => {
    setTimeout(() => {
      if (Math.random() >= 0.5) {
        let state = {
          mobile: '12345678901',
          userName: '张三'
        };

        dispatch(updateAccount(state));
        resolve && resolve(state);
      }
      else {
        reject && reject();
      }
    }, 1000);
  };
};
