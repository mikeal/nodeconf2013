var express = require('express');
var http = require('http');

var app = express();

var validate = function (username, password, callback) {
  var result = (username === 'steve' && password === '12345');
  callback(null, result);
};

var auth = express.basicAuth(validate);

var myMiddleware = function (req, res, next) {
  res.setHeader('X-API-Version', '1.0.0');
  return next();
};

app.configure(function() {
  app.use(myMiddleware);
  app.use(express.bodyParser());
  app.use(app.router);
});

var version = function (req, res) {
  var result = { version: '1.0.0' };
  res.json(result);
};
app.get('/version', version);

var users = require('./users.json');

var register = function (req, res) {
  // use req.body to create new user
};
app.post('/user', register);

var user = function (req, res) {
  if (!req.params.id) return res.json(users);
  var item = users[req.params.id];
  if (!item) return res.send(404, 'not found');
  res.json(item);
};
app.get('/user/:id?', auth, user);

http.createServer(app).listen(3000);
