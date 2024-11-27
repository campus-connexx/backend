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
exports.fetchActiveNews = exports.postNews = void 0;
const campusNews_1 = __importDefault(require("../models/campusNews"));
const postNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, text, link, startDate, endDate } = req.body;
        if (!userId || !text || !startDate || !endDate) {
            return res
                .status(400)
                .json({ error: "All required fields must be provided." });
        }
        // Create a new news item
        const news = new campusNews_1.default({
            userId,
            text,
            link,
            startDate,
            endDate,
        });
        // Save to database
        const savedNews = yield news.save();
        res
            .status(201)
            .json({ message: "News posted successfully", news: savedNews });
    }
    catch (error) {
        console.error("Error posting news:", error);
        res.status(500).json({ error: "Failed to post news." });
    }
});
exports.postNews = postNews;
const fetchActiveNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        // Query to find news items where the current date is between startDate and endDate
        const activeNews = yield campusNews_1.default.find({
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate },
        }).sort({ timestamp: -1 }); // Sorting by latest posted news first
        res.status(200).json({ news: activeNews });
    }
    catch (error) {
        console.error("Error fetching active news:", error);
        res.status(500).json({ error: "Failed to fetch news." });
    }
});
exports.fetchActiveNews = fetchActiveNews;
