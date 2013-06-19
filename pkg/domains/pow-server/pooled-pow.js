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

/*
 * Sets the crashiness factor -- 1 out of CRASH_FACTOR resource creation
 * requests will fail.
 */
var CRASH_FACTOR = 3;
var SERVER_URL = "http://localhost:1337";

function post(target, agent, input, callback) {
  var parsed = url.parse(target);

  var options = {
    hostname : parsed.hostname,
    port     : parsed.port,
    path     : parsed.path,
    method   : "POST",
    agent    : agent
  };

  /*
   * KATA: if the proof of work server eats it, what happens here?
   * FIXME: What's the best way to deal with bad responses from the server?
   */
  var req = http.request(options, function (res) {
    res.setEncoding("ascii");
    res.pipe(catenator(callback));
  });
  req.write(input);
  req.end();
}

/*
 * KATA: How do we make the connection pool domains-aware?
 * KATA: Where's the best place to put domains / error-handling? The client or the server?
 */
module.exports = poolificate({
  name               : "pow",
  create             : function (callback) {
    var agent = new Agent();
    agent.maxSockets = 1;

    if (Math.random() < 1 / CRASH_FACTOR) {
      return callback(new Error("unable to create connection to proof of work server " +
                                "(for some strange reason)!"));
    } else {
      post(SERVER_URL, agent, "bootstrap", function () {
        callback(null, {
          "prove": function (input, callback) {
            post(SERVER_URL, agent, input, callback);
          }
        });
      });
    }
  },
  destroy           : function () { /* do nothing */ },
  max               : cpus,
  min               : cpus / 2,
  idleTimeoutMillis : 30000,
  log               : true
});
