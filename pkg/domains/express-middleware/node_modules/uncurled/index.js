'use strict';

var request          = require('request');
var getStatusText    = require('http-status-codes').getStatusText;
var createReadStream = require('fs').createReadStream;
var PassThrough      = require('stream').PassThrough;
var URLEncodeStream  = require('urlencode-stream');
var argv             = require('./optimism.js').argv;

if (!PassThrough) PassThrough = require('readable-stream').PassThrough;

function dumpHeaders(res) {
  console.log("HTTP/%s.%s %s %s",
              res.httpVersionMajor, res.httpVersionMinor,
              res.statusCode, getStatusText(res.statusCode));

  Object.keys(res.headers).forEach(function (k) {
    console.log("%s: %s", k, res.headers[k]);
  });
  console.log();
}

var url     = argv._[0],
    method  = argv.request,
    options = {url : url, method : method};

function handler(error, res, body) {
  if (error) return console.error("uncurled barfed: %s", error.message);

  if (argv.include) dumpHeaders(res);

  console.log(body);
}

function _send(options, data, transformer) {
  options.method   = 'POST';

  var encoded;
  if (data[0] === '@') {
    var filename = data.slice(1);

    encoded = createReadStream(filename).pipe(transformer);
  }
  else if (data === '-') {
    encoded = process.stdin.pipe(transformer);
  }
  else {
    encoded = transformer;
    encoded.write(data);
    encoded.end();
  }

  return encoded;
}

function send(options, data, encoding, contentType) {
  options.headers  = {'Content-Type' : contentType};
  options.encoding = encoding;

  return _send(options, data, new PassThrough()).pipe(request(options, handler));
}

function sendURIEncoded(options, data) {
  options.headers  = {'Content-Type' : 'application/x-www-form-urlencoded'};
  options.encoding = 'ascii';

  return _send(options, data, new URLEncodeStream()).pipe(request(options, handler));
}

if (argv.data) {
  sendURIEncoded(options, argv.data);
}
else if (argv['data-ascii']) {
  sendURIEncoded(options, argv['data-ascii']);
}
else if (argv['data-binary']) {
  send(options, argv['data-binary'], 'binary', 'application/octet-stream');
}
else if (argv['data-json']) {
  send(options, argv['data-json'], 'utf8', 'application/json');
}
else {
  request(options, handler);
}
