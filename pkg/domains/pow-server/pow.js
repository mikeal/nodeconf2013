"use strict";

var domain       = require("domain");
var createServer = require("http").createServer;
var cluster      = require("cluster");
var cpus         = require("os").cpus().length;
var Hash         = require("crypto").Hash;
var catenator    = require("concat-stream");

/*
 * Sets the crashiness factor -- 2 out of CRASH_FACTOR requests will eat it,
*  on average.
 */
var CRASH_FACTOR = 3;

// "beefd" is a much better magic number than 0
function verify(input, proof) {
  if (!input) return;

  var hashed = new Hash("sha256").update(input).update(proof).digest("hex");
  if (hashed.substr(59, 5) === "beefd") return hashed;
}

function work(input) {
  var id = 0;
  while (true) {
    var proof = id.toString(16);

    if (verify(input, proof)) return proof;
    else id++;
  }
}

if (cluster.isMaster) {
  for (var i = 0; i < cpus; i++) cluster.fork();

  cluster.on("exit", function (worker) {
    console.error("Worker %s died. Welp. Time for another one.",
                  worker.process.pid);
    cluster.fork();
  });

  cluster.once("listening", function (worker, listener) {
    console.log("a worker (pid %s) is listening on %s:%s",
                worker.process.id, listener.address, listener.port);
    if (process.send) process.send({"ready": true});
  });
} else {
  createServer(function connected(req, res) {
    var d = domain.create();
    d.on("error", function (error) {
      console.error("I can't go on because this happened: %s\nExiting",
                    error.message);
      process.exit(1);
    });

    d.add(req);
    d.add(res);

    d.run(function () {
      // CRASHER: don't remove
      if (Math.random() < 1 / CRASH_FACTOR) {
        throw new Error("This problem is not to my liking. Giving up.");
      }

      req.pipe(catenator(function (body) {
        // CRASHER: don't remove
        if (Math.random() < 1 / CRASH_FACTOR) {
          res.writeHead(500, {"Content-Type": "application/json"});
          // this is going to cause problems.
          res.end("Couldn't compute proof. Throwing up.");
        } else {
          var source = body.toString("ascii");
          var proof = JSON.stringify({
            "input": source,
            "proof": work(source)
          });

          res.writeHead(200, {
            "Content-Type": "application/json",
            "Content-Length": proof.length
          });
          res.end(proof, "ascii");
        }
      }));
    });
  }).listen(1337, function listening() {
    console.log("worker %s ready", cluster.worker.id);
  });
}
