"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    roomName: {
        type: String,
        required: true,
        unique: true,
    },
    roomCreator: {
        type: String,
        required: true,
    },
    roomDescription: {
        type: String,
    },
    lastMessage: {
        type: String,
    },
    lastMessageTime: {
        type: Date,
    },
    imageLink: {
        type: String,
    },
    roomAdmins: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    roomMembers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    roomEvents: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Event",
        },
    ],
});
const Room = mongoose_1.default.model("Room", RoomSchema);
exports.default = Room;
