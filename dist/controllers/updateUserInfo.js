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
exports.updateUserInfo = void 0;
const user_1 = __importDefault(require("../models/user"));
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, department, regulation, interests, rollno } = req.body;
    const clerkId = userId;
    console.log("Received data:", { userId, department, regulation, interests, rollno });
    try {
        // Find the user by clerkId and update the fields
        const updatedUser = yield user_1.default.findOneAndUpdate({ clerkId }, {
            department,
            regulation,
            interests,
            rollno,
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User info updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("Error updating user info:", error);
        res.status(500).json({ message: "Error updating user info" });
    }
});
exports.updateUserInfo = updateUserInfo;
