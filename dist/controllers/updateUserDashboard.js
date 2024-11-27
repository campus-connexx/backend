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
exports.updateUserDashboard = void 0;
const user_1 = __importDefault(require("../models/user"));
const updateUserDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, category, data } = req.body;
    console.log("called updateUserDashboard");
    console.log("Received user data:", req.body);
    try {
        const user = yield user_1.default.findOne({ clerkId: userId });
        console.log("User found:", user === null || user === void 0 ? void 0 : user.name);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        switch (category) {
            case "attendance":
            case "gpa":
                // Overwrite primitive fields
                user[category] = parseFloat(data[category]);
                break;
            case "grades":
                // Overwrite Map fields
                Object.entries(data).forEach(([key, value]) => {
                    if (!user.grades) {
                        user.grades = new Map();
                    }
                    user.grades.set(key, value);
                });
                break;
            case "upcomingAssignments":
                // Append a new assignment to the array
                if (Array.isArray(user.upcomingAssignments)) {
                    user.upcomingAssignments.push(data);
                }
                else {
                    console.log("error appending assignment because user.upcomingAssignments is not an array");
                }
                break;
            case "upcomingExams":
                // Append a new exam to the array
                if (Array.isArray(user.upcomingExams)) {
                    user.upcomingExams.push(data);
                }
                else {
                    console.log("error appending assignment because user.upcomingExams is not an array");
                }
                break;
            case "achievements":
                // Append a new achievement to the array
                if (Array.isArray(user.achievements)) {
                    user.achievements.push(data);
                }
                else {
                    console.log("error appending assignment because user.user.achievents is not an array");
                }
                break;
            case "certificates":
                // Append a new certificate to the array
                if (Array.isArray(user.certificates)) {
                    user.certificates.push(data);
                }
                else {
                    console.log("error appending assignment because user.certificates is not an array");
                }
                break;
            case "extracurricularActivities":
                // Append a new activity to the array
                if (Array.isArray(user.extracurricularActivities)) {
                    user.extracurricularActivities.push(data.activity);
                }
                else {
                    user.extracurricularActivities = [data.activity];
                }
                break;
            default:
                return res.status(400).json({ message: "Invalid category" });
        }
        yield user.save();
        res.status(200).json({
            message: "User details updated successfully",
            user,
        });
    }
    catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Error updating user details" });
    }
});
exports.updateUserDashboard = updateUserDashboard;
