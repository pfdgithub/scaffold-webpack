module.exports = (req, res, next) => {
  res.cookie('serverTime', Date.now());

  res.json({
    code: 0,
    message: '',
    data: {
      query: req.query,
      body: req.body,
      cookie: req.cookies
    }
  });
};