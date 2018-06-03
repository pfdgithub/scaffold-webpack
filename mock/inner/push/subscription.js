const db = require('./db.js');

module.exports = (req, res, next) => {
  let identifier = req.body.identifier;
  let subscription = req.body.subscription;

  if (subscription && subscription.endpoint) {
    db.subscribe(identifier, subscription);

    res.json({
      code: 0,
      message: '',
      data: {
        identifier,
        subscription
      }
    });
  }
  else {
    res.json({
      code: -1,
      message: 'invalid subscription',
      data: {
        identifier,
        subscription
      }
    });
  }
};