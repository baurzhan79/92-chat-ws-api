const express = require("express");
const { nanoid } = require("nanoid");

const app = express();
require("express-ws")(app);

const router = express.Router();

const createRouterchatWS = () => {
    const activeConnections = {};

    router.ws("/", function (ws, req) {
        const id = nanoid();
        console.log("client connected! id=", id);

        activeConnections[id] = ws;
        ws.on("close", (msg) => {
            console.log("client disconnected! id=", id);
            delete activeConnections[id];
        });

        ws.on("message", (msg) => {
            const decodedMessage = JSON.parse(msg);
            switch (decodedMessage.type) {
                case "CREATE_MESSAGE":
                    Object.keys(activeConnections).forEach(connId => {
                        const conn = activeConnections[connId];
                        conn.send(JSON.stringify({
                            type: "NEW_MESSAGE",
                            message: {
                                username: decodedMessage.username,
                                text: decodedMessage.text
                            }
                        }));
                    });
                    break;

                default:
                    console.log("Unknown message type:", decodedMessage.type);
            }
        });
    });

    return router;
}

module.exports = createRouterchatWS;