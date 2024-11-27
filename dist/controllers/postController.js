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
exports.getPosts = exports.createPost = void 0;
const room_1 = __importDefault(require("../models/room")); // Assuming you have a Room model
const post_1 = require("../models/post");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomName, userId, imageUrl, caption } = req.body;
    console.log("Creating post:", req.body);
    try {
        // Check if the room exists
        const room = yield room_1.default.findOne({ roomName: roomName });
        if (!room) {
            return res
                .status(404)
                .json({ message: "Room not found. Please create it first." });
        }
        // Create the post
        const post = new post_1.Post({
            roomId: room._id,
            userId,
            imageUrl,
            caption,
        });
        yield post.save();
        res.status(201).json({ message: "Post created successfully!", post });
    }
    catch (error) {
        console.error("Error creating post:", error);
        res
            .status(500)
            .json({ message: "An error occurred while creating the post." });
    }
});
exports.createPost = createPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch posts with associated room details
        const posts = yield post_1.Post.find().populate("roomId", "roomName _id");
        res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res
            .status(500)
            .json({ message: "An error occurred while fetching posts." });
    }
});
exports.getPosts = getPosts;
