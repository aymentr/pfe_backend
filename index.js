const http = require('http');
const socketIO = require('socket.io');
var express = require('express');
const cors = require("cors");

const bp = require("body-parser");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");
require("./middlewares/passport")(passport);


var app = express();
app.use(bp.json());

const { DB, PORT } = require("./config");

const userController = require("./controllers/userController");
const lineController = require("./controllers/linecontroller");
const machineController = require("./controllers/machinecontroller");
const historyController = require("./controllers/historyController");



//Enable CORS
app.use(cors({ origin: "*" }));
app.use(express.static(__dirname + '/dist'));

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*'
    }
});

app.set('io', io);
// Middlewares

app.use(passport.initialize());
app.use('/users', userController);
app.use('/lines', lineController);
app.use('/machines', machineController);
app.use('/history', historyController);



// Initialize the application



// User Router Middlewar

const startApp = async() => {
    try {
        // Connection With DB
        await connect(DB, {
            useFindAndModify: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        success({
            message: `Successfully connected with the Database \n${DB}`,
            badge: true
        });

        // Start Listenting for the server on PORT
        server.listen(PORT, () =>
            success({ message: `Server started on PORT ${PORT}`, badge: true })
        );
    } catch (err) {
        error({
            message: `Unable to connect with Database \n${err}`,
            badge: true
        });
        startApp();
    }
};
startApp();