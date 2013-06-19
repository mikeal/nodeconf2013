"use strict";

var fork         = require("child_process").fork;
var catenator    = require("concat-stream");
var createServer = require("http").createServer;

/*
 * The connection pool is built with the generic-pool module. Obtain a
 * connection by calling pool.acquire, which takes a callback taking
 * two parameters, an error and a client API object.
 *
 * The API has a single method on it, prove(), which takes a source
 * string to be sent to the proof-of-work service, as well as a
 * callback that will be called with the proof returned from the
 * service.
 *
 * HINT: there is one domain method that will bind the callback passed to proof.
 */
var pool = require("./pooled-pow.js");

// start up the proof of work server
var pow = fork("./pow.js");

/**
 ** FIXME: how do we use domains with pooled connections?
 **
 ** HINT: generic-pool instances need to be drained at shutdown
 ** HINT: the worker process needs to be stopped at shutdown
 **/
createServer(function connected(req, res) {
  req.pipe(catenator(function (body) {
    var source = body.toString("ascii");

    pool.acquire(function (error, client) {
      client.prove(source, function (proof) {
        // throw new Error("OH NOOO"); // FIXME: how does this get trapped by a domain?
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Length": proof.length
        });

        res.end(proof);
        pool.release(client);
      });
    });
  }));
}).listen(8080, function listening() {
  console.log("proof of work connection pool up and running");
});
