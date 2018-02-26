module.exports = (req, res) => {
  res.cookie('serverTime', Date.now());

  res.json({
    code: 0,
    message: "",
    data: {
      query: req.query,
      body: req.body,
      cookie: req.cookies
    }
  });
};