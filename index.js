const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

function httpToHttps(req, res, next) {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(["https://", req.get("Host"), req.url].join(""));
  }

  return next();
}

app.use(httpToHttps);
app.use(express.static("build"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/build", "index.html"));
});

app.listen(port);
