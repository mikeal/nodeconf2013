"use strict";

var fork         = require("child_process").fork;
var catenator    = require("concat-stream");
var createServer = require("http").createServer;

// start up the proof of work server
var pow = fork("./pow.js");

// KATA: what's a better way, using domains, to cleanly shut down the proof
// of work server?
process.on('exit', function () { pow.kill(); });

pow.once("message", function (status) {
  console.log("child process ready.\nbooting front-end server.");

  /*
   * The connection pool is built with the generic-pool module. Obtain a
   * connection by calling pool.acquire, which takes a callback taking
   * two parameters, an error and a client API object.
   *
   * Any resource acquired from a pool needs to be released back to it
   * at the end of processing. Not doing so is an error.
   *
   * KATA: ensure that the client gets released, even in cases of errors.
   *
   * The API has a single method on it, prove(), which takes a source
   * string to be sent to the proof-of-work service, as well as a
   * callback that will be called with the proof returned from the
   * service.
   *
   * HINT: there is one domain method that will bind the callback passed to proof.
   */
  var pool = require("./pooled-pow.js");

  if (status.ready) {
    /**
     ** KATA: what's the value of running the entire thing inside a domain?
     ** KATA: how do we use domains with pooled connections?
     **
     ** HINT: generic-pool instances need to be drained at shutdown
     ** HINT: the worker process needs to be stopped at shutdown
     **/
    createServer(function connected(req, res) {
      req.pipe(catenator(function (body) {
        var source = body.toString("ascii");

        pool.acquire(function (error, client) {
          client.prove(source, function (input) {
            /*
             * KATA: what happens when this fails?
             * Without removing the validation that the parsing adds, make it
             * less crash-prone using domains.
             */
            var proofObject = JSON.parse(input);
            var proof = JSON.stringify(proofObject);

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
      console.log("proof of work front end server and running");
    });
  }
});

