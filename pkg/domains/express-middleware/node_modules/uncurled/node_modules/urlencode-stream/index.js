'use strict';

var util      = require('util');
var Transform = require('stream').Transform;

if (!Transform) Transform = require('readable-stream').Transform;

function URLEncodeStream(options) {
  if (!(this instanceof URLEncodeStream)) return new URLEncodeStream(options);

  Transform.call(this, options);
}
util.inherits(URLEncodeStream, Transform);

URLEncodeStream.prototype._transform = function (chunk, encoding, callback) {
  if (encoding === 'buffer') encoding = 'binary';

  this.push(encodeURIComponent(chunk.toString(encoding)));

  return callback();
};

module.exports = URLEncodeStream;
