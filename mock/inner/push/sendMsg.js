const webpush = require('web-push');
const db = require('./db.js');

webpush.setVapidDetails('mailto:sender@example.com', db.key.publicKey, db.key.privateKey);

module.exports = (req, res, next) => {
  let identifier = req.body.identifier;
  let payload = req.body.payload;

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