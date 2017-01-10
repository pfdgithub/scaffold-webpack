module.exports = (req, res/*, app*/) => {
  res.cookie('serverTime', Date.now());

  return {
    code: 0,
    message: "",
    data: {
      query: req.query,
      body: req.body,
      cookie: req.cookies
    }
  };
};