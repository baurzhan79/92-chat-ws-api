const express = require("express");

const app = express();
require("express-ws")(app);

const router = express.Router();

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

            ws.on("message", (msg) => {
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

                    default:
                        console.log("Unknown message type:", decodedMessage.type);
                }
            });
        }
    });

    return router;
}

module.exports = createRouterchatWS;