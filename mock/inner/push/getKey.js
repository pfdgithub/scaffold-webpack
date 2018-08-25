const db = require('./db.js');

module.exports = (req, res, next) => {
  let identifier = req.body.identifier;

  let key = db.getKey(identifier);
  if (key) {
    res.json({
      code: 0,
      data: {
        identifier: identifier,
        publicKey: key.publicKey
      }
    });
  }
  else {
    res.json({
      code: -1,
      message: 'invalid identifier',
      data: {
        identifier: identifier,
        publicKey: key.publicKey
      }
    });
  }
};