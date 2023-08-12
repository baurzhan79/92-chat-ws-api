const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const users = require("./app/users");
const chatWs = require("./app/chatWs");

const app = express();
require("express-ws")(app);
const port = 8000;

app.use(cors());
app.use(express.json());

const runMongoose = async () => {
    await mongoose.connect("mongodb://localhost/chat-ws", { useNewUrlParser: true });
    console.log("mongoose connected");

    app.use("/users", users());
    app.use("/chat", chatWs());

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

runMongoose();