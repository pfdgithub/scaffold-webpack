const webpush = require('web-push');
const db = require('./db.js');

module.exports = (req, res, next) => {
  let identifier = req.body.identifier;
  let payload = req.body.payload;

  let key = db.getKey(identifier);
  if (!key) {
    res.json({
      code: -1,
      message: 'invalid identifier',
      data: {
        identifier: identifier,
        publicKey: key.publicKey
      }
    });

    return;
  }

  webpush.setVapidDetails('mailto:sender@example.com', key.publicKey, key.privateKey);

  let pList = [];
  db.traversal(identifier, (subscription) => {
    pList.push(webpush.sendNotification(subscription, JSON.stringify(payload), db.pushOptions));
  });

  Promise.all(pList)
    .then((list) => {
      res.json({
        code: 0,
        message: '',
        data: list
      });
    }).catch((err) => {
      res.json({
        code: -1,
        message: err.toString() || err.statusCode,
        data: err
      });
    });
};