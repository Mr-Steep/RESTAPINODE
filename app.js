const express = require("express");
const bodyParser = require("body-parser");
const router = require('./src/router.js');

const app = express();
const HTTP_PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router);

//startserver
app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

