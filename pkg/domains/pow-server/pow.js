"use strict";

var domain       = require("domain");
var createServer = require("http").createServer;
var cluster      = require("cluster");
var cpus         = require("os").cpus().length;
var Hash         = require("crypto").Hash;
var catenator    = require("concat-stream");

// "beefd" is a much better magic number than 0
function verify(input, nonce) {
  if (!input) return;

  var hashed = new Hash("sha256").update(input).update(nonce).digest("hex");
  if (hashed.substr(59, 5) === "beefd") return hashed;
}

function work(input) {
  var id = 0;
  while (true) {
    var nonce = id.toString(16);

    if (verify(input, nonce)) return nonce;
    else id++;
  }
}

if (cluster.isMaster) {
  for (var i = 0; i < cpus; i++) cluster.fork();

  cluster.on("exit", function (worker) {
    console.error("Worker " + worker.process.pid + " died. Welp. Time for another one.");
    cluster.fork();
  });
} else {
  createServer(function connected(req, res) {
    var d = domain.create();
    d.on("error", function (error) {
      console.error("I can't go on because this happened: %s\nExiting",
                    error.message);
    });

    d.add(req);
    d.add(res);
    d.run(function () {
      req.pipe(catenator(function (body) {
        var source = body.toString("ascii");
        var proof = JSON.stringify({
          "input": source,
          "nonce": work(source)
        });

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Length": proof.length
        });
        res.end(proof, "ascii");
      }));
    });

  }).listen(1337, function listening() {
    console.log("worker %s ready", cluster.worker.id);
  });
}
