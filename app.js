require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const docs = require("./routes/docs.js");
const auth = require("./routes/auth.js");

const app = express();
const httpServer = require("http").createServer(app);

const port = process.env.PORT || 1337;

const visual = true;
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema
} = require("graphql");

const RootQueryType = require("./graphql/root.js");


app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const schema = new GraphQLSchema({
    query: RootQueryType
});

app.use("/docs", docs);
app.use("/auth", auth);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual,
}));

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
