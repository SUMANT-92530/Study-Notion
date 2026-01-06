const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

exports.auth = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.body?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ success: false, message: `Token Missing` });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decode);
            req.user = decode;  
            console.log("heyyy")
        }
         catch (error) {
            return res.status(401).json({ success: false, message: "token is invalid" });
        }

        next();
    } catch (error) {
        console.error("AUTH_MIDDLEWARE_ERROR...", error);
        return res.status(401).json({
            success: false,
            message: `Something Went Wrong While Validating the Token`,
        });
    }
};

exports.isStudent = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });

        // FIX: Check if userDetails exists before accessing accountType
        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (userDetails.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Students",
            });
        }
        next();
    } catch (error) {
        console.error("IS_STUDENT_ERROR...", error);
        return res.status(500).json({ success: false, message: `User Role Can't be Verified` });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });

        // FIX: Check if userDetails exists
        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (userDetails.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin",
            });
        }
        next();
    } catch (error) {
        console.error("IS_ADMIN_ERROR...", error);
        return res.status(500).json({ success: false, message: `User Role Can't be Verified` });
    }
};

exports.isInstructor = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });

        // FIX: Check if userDetails exists
        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (userDetails.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Instructor",
            });
        }
        next();
    } catch (error) {
        console.error("IS_INSTRUCTOR_ERROR...", error);
        return res.status(500).json({ success: false, message: `User Role Can't be Verified` });
    }
};