/**
 ** WARNING: NO USER-SERVICEABLE PARTS INSIDE
 **/

"use strict";

var poolificate = require("generic-pool").Pool;
var cpus        = require("os").cpus().length;
var catenator   = require("concat-stream");
var url         = require("url");
var http        = require("http");
var Agent       = http.Agent;

function post(target, agent, input, callback) {
  var parsed = url.parse(target);

  var options = {
    hostname : parsed.hostname,
    port     : parsed.port,
    path     : parsed.path,
    method   : "POST",
    agent    : agent
  };

  var req = http.request(options, function (res) {
    res.setEncoding("ascii");
    res.pipe(catenator(callback));
  });
  req.write(input);
  req.end();
}

module.exports = poolificate({
  name               : "pow",
  create             : function (callback) {
    var agent = new Agent();
    agent.maxSockets = 1;

    callback(null, {
      "prove": function (input, callback) {
        post("http://localhost:1337", agent, input, callback);
      }
    });
  },
  destroy           : function () { /* do nothing */ },
  max               : cpus,
  min               : cpus / 2,
  idleTimeoutMillis : 30000,
  log               : true
});
