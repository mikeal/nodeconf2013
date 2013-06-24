var express = require('express');
var http = require('http');

var app = express();

app.configure(function () {
  app.use(app.router);
});

app.get('/version', function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  var result = { version: '1.0.0' };
  res.end(JSON.stringify(result));
});

http.createServer(app).listen(3000);
