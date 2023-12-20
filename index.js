// index.js

const express = require("express");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("./configs/db.js");
// app.use(cors());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 4000;

app.use("/api", routes);
//app.use(cors());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
