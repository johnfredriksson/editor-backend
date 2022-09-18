require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const docs = require("./routes/docs.js");

const app = express();

const port = process.env.PORT || 1337;

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/docs", docs);

app.get('/', (req, res) => {
    res.json({
        msg: "Editor",
    });
});

const server = app.listen(port, () => {
    console.log('Editor api listening on port ' + port);
});

module.exports = server;
