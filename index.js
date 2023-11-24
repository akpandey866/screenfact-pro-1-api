// index.js

const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const app = express();
require("./configs/db.js");
app.use(bodyParser.json());
const port = 3000;

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

