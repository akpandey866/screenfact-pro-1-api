// index.js

const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require("./configs/db.js");
app.use(bodyParser.json());
const port = 3001;

app.use(cors());

app.use('/', routes);
//app.use(cors());



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

