"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CampusNewsSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    text: { type: String, required: true },
    link: { type: String },
    timestamp: { type: Date, default: Date.now },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});
const CampusNews = (0, mongoose_1.model)("CampusNews", CampusNewsSchema);
exports.default = CampusNews;
