const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./database/mongodb");
const runServer = require("./mainRoute");

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
};
app.use(cors(corsOpts));
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
runServer(app);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to simple node js app");
})

module.exports = app;