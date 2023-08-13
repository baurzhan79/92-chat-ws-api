const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const User = require("./app/models/User");
const ChatMessages = require("./app/models/ChatMessages");

mongoose.connect("mongodb://localhost/chat-ws");
const db = mongoose.connection;

db.once("open", async () => {
    try {
        await db.dropCollection("users");
        await db.dropCollection("chatmessages");

    } catch (e) {
        console.log("Collections were not present, skipping drop...");
    }

    const [UserUser, UserAdmin] = await User.create(
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

    await ChatMessages.create(
        {
            text: "message 1",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 2",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 3",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 4",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 5",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 6",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 7",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 8",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 9",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 10",
            author: UserAdmin._id,
            datetime: new Date()
        }
    );

    await ChatMessages.create(
        {
            text: "message 11",
            author: UserUser._id,
            datetime: new Date()
        },
        {
            text: "message 12",
            author: UserUser._id,
            datetime: new Date()
        },
        {
            text: "message 13",
            author: UserUser._id,
            datetime: new Date()
        },
        {
            text: "message 14",
            author: UserUser._id,
            datetime: new Date()
        },
        {
            text: "message 15",
            author: UserUser._id,
            datetime: new Date()
        },
        {
            text: "message 16",
            author: UserUser._id,
            datetime: new Date()
        },
        {
            text: "message 17",
            author: UserUser._id,
            datetime: new Date()
        },
        {
            text: "message 18",
            author: UserUser._id,
            datetime: new Date()
        },
        {
            text: "message 19",
            author: UserUser._id,
            datetime: new Date()
        },
        {
            text: "message 20",
            author: UserUser._id,
            datetime: new Date()
        }
    );

    await ChatMessages.create(
        {
            text: "message 21",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 22",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 23",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 24",
            author: UserAdmin._id,
            datetime: new Date()
        },
        {
            text: "message 25",
            author: UserAdmin._id,
            datetime: new Date()
        }
    );

    db.close();
    console.log("Connect closed");
});
