const express = require("express");

const ChatMessages = require("./models/ChatMessages");

const app = express();
require("express-ws")(app);

const router = express.Router();

const messagesCount = 30;
const getLastMessages = async (messagesCount) => {
    try {
        let data = [];

        const allMessages = await ChatMessages.find().sort([["datetime", 1]]).populate("author");
        allMessages.forEach(message => {
            data.push({
                username: message.author.username,
                text: message.text
            });
        });

        if (messagesCount === 0 || messagesCount >= data.length) return data;
        else {
            const lastMessages = data.slice(data.length - messagesCount);
            return lastMessages;
        }
    }
    catch (e) {
        return [];
    }
}

const createRouterchatWS = () => {
    const activeConnections = {};

    router.ws("/", function (ws, req) {
        if (req.query.token) {
            const token = req.query.token;
            console.log("client connected! token=", token);

            activeConnections[token] = {
                connection: ws,
                username: req.query.username
            };

            let onlineUsers = [];

            Object.keys(activeConnections).forEach(connId => {
                const conn = activeConnections[connId];
                onlineUsers.push(conn.username);
            });

            ws.on("close", (msg) => {
                console.log("client disconnected! token=", token);
                delete activeConnections[token];

                onlineUsers = [];

                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];
                    onlineUsers.push(conn.username);
                });

                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId].connection;
                    conn.send(JSON.stringify({
                        type: "ONLINE_USERS",
                        users: JSON.stringify(onlineUsers)
                    }));
                });
            });

            ws.on("message", async (msg) => {
                const decodedMessage = JSON.parse(msg);
                switch (decodedMessage.type) {
                    case "GET_ONLINE_USERS":
                        Object.keys(activeConnections).forEach(connId => {
                            const conn = activeConnections[connId].connection;
                            conn.send(JSON.stringify({
                                type: "ONLINE_USERS",
                                users: JSON.stringify(onlineUsers)
                            }));
                        });

                        break;

                    case "GET_LAST_MESSAGES":
                        const lastMessages = await getLastMessages(messagesCount);

                        const conn = activeConnections[decodedMessage.token].connection;
                        conn.send(JSON.stringify({
                            type: "LAST_MESSAGES",
                            messages: lastMessages
                        }));

                        break;

                    case "CREATE_MESSAGE":
                        const newMessage = new ChatMessages();
                        newMessage.text = decodedMessage.text;
                        newMessage.author = decodedMessage.userId;
                        newMessage.datetime = new Date();

                        try {
                            await newMessage.save();

                            Object.keys(activeConnections).forEach(connId => {
                                const conn = activeConnections[connId].connection;
                                conn.send(JSON.stringify({
                                    type: "NEW_MESSAGE",
                                    message: {
                                        username: decodedMessage.username,
                                        text: decodedMessage.text
                                    }
                                }));
                            });
                        }
                        catch (error) {

                        }

                        break;

                    default:
                        console.log("Unknown message type:", decodedMessage.type);
                }
            });
        }
    });

    return router;
}

module.exports = createRouterchatWS;