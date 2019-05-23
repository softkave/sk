const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static("build"));
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "/build", "index.html"));
});

app.listen(port);