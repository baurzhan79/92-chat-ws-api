const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatMessagesSchema = new Schema(
    {
        text: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        datetime: {
            type: Date,
            default: new Date()
        }
    },
    {
        versionKey: false
    }
);

const ChatMessages = mongoose.model("ChatMessages", ChatMessagesSchema);

module.exports = ChatMessages;