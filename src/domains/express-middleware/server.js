var http          = require("http");
var domain        = require("domain");
var path          = require("path");
var express       = require("express");
var domainHandler = require("./domain-errors.js");

function databaseCall() {
  throw new Error("oh no the database exploded");
}

var app = express();

app.set("port", process.env.PORT || 1337);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));
app.use(domainHandler());

app.get("/", function (req, res) {
  res.render("index", {title : "Express"});
});

app.get("/throw", function (req, res) {
  throw new Error("Imagine I'm deeper in the code");
});

app.get("/handle", function (req, res) {
  var subDomain = domain.create();
  subDomain.on("error", function (error) {
    res.send(500, "<html><head><title>whoops</title></head><body>" +
             "<p>Got error: '" + error.message + "'. Ignoring.</p>" +
             "</body></html>");
  });

  subDomain.run(databaseCall);
});

var mainDomain = domain.create();
mainDomain.on("error", function (error) {
  console.error("caught %s in main domain, shutting down", error.message);
  process.exit(1);
});

mainDomain.run(function () {
  http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
  });
});
