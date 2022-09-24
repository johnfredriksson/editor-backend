require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const docs = require("./routes/docs.js");

const app = express();
const httpServer = require("http").createServer(app);

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

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.sockets.on("connection", function(socket) {
    console.log(socket.id);

    socket.on("create", function(room) {
        console.log("joining room: " + room);
        socket.join(room);
    });

    socket.on("doc", function(data) {
        console.log("Got socket emit")
        // socket.emit("doc", data);
        socket.to(data["_id"]).emit("doc", data);
    })
});

const server = httpServer.listen(port, () => {
    console.log('Editor api listening on port ' + port);
});

module.exports = server;
