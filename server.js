const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const chatWs = require("./app/chatWs");
const users = require("./app/users");

const app = express();
require("express-ws")(app);
const port = 8000;

app.use(cors());

const runMongoose = async () => {
    await mongoose.connect("mongodb://localhost/chat-ws", { useNewUrlParser: true });
    console.log("mongoose connected");

    app.use("/chat", chatWs());
    app.use("/users", users());

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

runMongoose();