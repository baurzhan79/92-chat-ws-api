const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const User = require("./app/models/User")

mongoose.connect("mongodb://localhost/chat-ws");
const db = mongoose.connection;

db.once("open", async () => {
    try {
        await db.dropCollection("users");
    } catch (e) {
        console.log("Collections were not present, skipping drop...");
    }

    await User.create(
        {
            username: "user",
            email: "user@chatWs.com",
            password: "123456",
            token: nanoid(),
            role: "user"
        },
        {
            username: "admin",
            email: "admin@chatWs.com",
            password: "123456",
            token: nanoid(),
            role: "admin"
        }
    );

    db.close();
    console.log("Connect closed");
});
