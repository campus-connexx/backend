"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//models
const user_1 = __importDefault(require("./models/user")); // Ensure the correct import
const room_1 = __importDefault(require("./models/room")); // Ensure the correct import
const message_1 = __importDefault(require("./models/message"));
//controllers
const campusInfoController_1 = require("./controllers/campusInfoController");
const userController_1 = require("./controllers/userController");
const updateUserInfo_1 = require("./controllers/updateUserInfo");
const updateUserDashboard_1 = require("./controllers/updateUserDashboard");
const postController_1 = require("./controllers/postController");
const roomsController_1 = require("./controllers/roomsController");
const newsController_1 = require("./controllers/newsController");
// essential imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport"); // passport is a middleware for authentication
const localStrategy = require("passport-local").Strategy;
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // handle URL-encoded data
app.use(bodyParser.json()); // handle JSON-encoded data
app.use(passport.initialize());
const jwt = require("jsonwebtoken");
const mongoose_url = "mongodb+srv://userconnexx:4XbIWfAojr4Rv0dz@cluster0.uuw5l.mongodb.net/";
mongoose
    .connect(mongoose_url)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
// app.post("/register", async (req: any, res: any) => {
//   const { name, email, username } = req.body;
//     // create a new user
//     console.log("Creating user", req.body);
//   const newUser = new User({
//       email,
//     name,
//     username,
//   });
//   newUser.save().then((user: any) => {
//     res.status(200).json("User created Successfully: " + user);
//   }).catch((err: any) => {
//       res.status(500).json(err + "Error creating user");
//       console.log(err);
//   });
// });
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, username, clerkId } = req.body;
    console.log("Received user data:", req.body);
    // create a new user
    const newUser = new user_1.default({
        clerkId,
        username,
        name,
        email,
    });
    console.log(newUser);
    newUser
        .save()
        .then((user) => {
        res.status(200).json("User created Successfully: " + user);
    })
        .catch((err) => {
        res.status(500).json("Error creating user: " + err);
        console.log(err);
    });
}));
// end point to access all users except the user who ia currently logged in
app.get("/rooms/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = req.params.userId;
    console.log("Logged in user id: ", loggedInUserId);
    user_1.default.findOne({ clerkId: loggedInUserId })
        .populate("partOfRooms")
        .then((room) => {
        if (room) {
            console.log("Rooms retrieved successfully", room.partOfRooms.length);
            res.status(200).json(room.partOfRooms);
        }
        else {
            res.status(404).json("User not found");
        }
    })
        .catch((err) => {
        res.status(500).json(err);
        console.log("Error retrieving rooms " + err);
    });
}));
// end point to create rooms
app.post("/rooms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomName, roomCreator, roomDescription, imageLink } = req.body;
    console.log("Creating room serer", req.body);
    const roomAdmin = yield user_1.default.findOne({ clerkId: roomCreator });
    const newRoom = new room_1.default({
        roomName,
        roomCreator,
        roomAdmins: [roomAdmin],
        roomDescription,
        imageLink,
    });
    newRoom
        .save()
        .then((room) => {
        if (roomAdmin) {
            roomAdmin.partOfRooms.push(newRoom._id);
            roomAdmin
                .save()
                .then((user) => {
                console.log("User updated with room", user);
            })
                .catch((err) => {
                console.log("Error updating user with room", err);
            });
            res.status(200).json("Room created Successfully: " + room);
        }
        else {
            res.status(404).json("Room creator not found");
        }
    })
        .catch((err) => {
        res.status(500).json(err + "Error creating room");
        console.log(err);
    });
}));
app.get("/getAllRooms", roomsController_1.getAllRooms);
app.get("/campus-info", campusInfoController_1.getCampusInfo);
app.get("/user", userController_1.getUserData);
app.put("/user/update-info", updateUserInfo_1.updateUserInfo);
app.put("/user/updateUserDashboard", updateUserDashboard_1.updateUserDashboard);
app.post("/createPost", postController_1.createPost);
app.get("/posts", postController_1.getPosts);
app.post("/news", newsController_1.postNews);
app.get("/news/active", newsController_1.fetchActiveNews);
const multer = require("multer");
// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "files/"); // Specify the desired destination folder
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });
app.post("/sendMessage", upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Received message data:", req.body);
        const { message, senderId, messageType, roomId, imageUrl } = req.body;
        console.log("Received message data:", req.body);
        const sender = yield user_1.default.findOne({ clerkId: senderId });
        const room = yield room_1.default.findById(roomId);
        const newMessage = new message_1.default({
            message,
            senderId: sender,
            messageType,
            roomId: room,
            timestamp: new Date(),
            imageUrl: messageType === "image" ? imageUrl : "",
        });
        yield newMessage.save();
        if (room) {
            room.lastMessage = newMessage.message;
            room.lastMessageTime = newMessage.timestamp;
            yield room.save();
        }
        else {
            res.status(404).json("Room not found");
            return;
        }
        res.status(200).json("Message sent successfully");
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json("Failed to send message");
    }
}));
app.get("/room/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const room = yield room_1.default.findById(roomId);
        // console.log("Room retrieved successfully", room);
        res.status(200).json(room);
    }
    catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json("Failed to get user");
    }
}));
// end point to fetch all messages in a room
app.get("/messages/:userId/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId, roomId } = req.params;
        const user = yield user_1.default.findOne({ clerkId: userId });
        const room = yield room_1.default.findById(roomId);
        if ((room === null || room === void 0 ? void 0 : room._id) && ((_a = user === null || user === void 0 ? void 0 : user.partOfRooms) === null || _a === void 0 ? void 0 : _a.includes(room._id))) {
            const messages = yield message_1.default.find({ roomId }).populate("senderId");
            res.status(200).json(messages);
        }
        else {
            res.status(403).json("You are not a member of this room");
        }
    }
    catch (error) {
        console.error("Error getting messages:", error);
        res.status(500).json("Failed to get messages");
    }
}));
// fetch current user data based on user Id
app.get("/user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("User ID", req.params);
        const { userId } = req.params;
        const user = yield user_1.default.findOne({ clerkId: userId });
        // console.log("User retrieved successfully", user);
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json("Failed to get user");
    }
}));
//searching for rooms based on keyword availability in roomname or room description
app.get("/search/:keyword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Searching for rooms with keyword:", req.params);
        const { keyword } = req.params;
        const rooms = yield room_1.default.find({
            $or: [
                { roomName: { $regex: keyword, $options: "i" } },
                { roomDescription: { $regex: keyword, $options: "i" } },
            ],
        });
        res.status(200).json(rooms);
    }
    catch (error) {
        console.error("Error searching for rooms:", error);
        res.status(500).json("Failed to search for rooms");
    }
}));
// end point to let user join a room
app.post("/joinRoom", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, roomId } = req.body.params;
        console.log("Joining room:", userId, roomId);
        // Fetch the user and room details
        const user = yield user_1.default.findOne({ clerkId: userId });
        const room = yield room_1.default.findById(roomId);
        console.log("User found to join");
        console.log("Room found:", room === null || room === void 0 ? void 0 : room.roomName);
        if (user && room) {
            // Check if the user is already part of the room
            const isUserInRoom = user.partOfRooms.some((roomIdInUser) => roomIdInUser.toString() === room._id.toString());
            if (isUserInRoom) {
                return res.status(400).json("User is already part of the room");
            }
            // Add the room to the user's partOfRooms array
            user.partOfRooms.push(room._id);
            yield user.save();
            res
                .status(200)
                .json({ message: "Room joined successfully", roomName: room.roomName });
        }
        else {
            res.status(404).json("User or room not found");
        }
    }
    catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json("Failed to join room");
    }
}));
// handle roomName change
app.post("/changeGroupName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Updating group name:", req.body);
        const { roomId, updatedroomName } = req.body;
        const room = yield room_1.default.findById(roomId);
        if (room) {
            room.roomName = updatedroomName;
            yield room.save();
            res.status(200).json("Group name updated successfully");
        }
        else {
            res.status(404).json("Room not found");
        }
    }
    catch (error) {
        console.error("Error updating group name:", error);
        res.status(500).json("Failed to update group name");
    }
}));
//handle image link change
app.post("/changeImageLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Updating image link:", req.body);
        const { roomId, imageLink } = req.body;
        const room = yield room_1.default.findById(roomId);
        if (room) {
            room.imageLink = imageLink;
            yield room.save();
            res.status(200).json("Image link updated successfully");
        }
        else {
            res.status(404).json("Room not found");
        }
    }
    catch (error) {
        console.error("Error updating image link:", error);
        res.status(500).json("Failed to update image link");
    }
}));
// handle permission updatess
