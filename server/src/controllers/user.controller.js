import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();  // Fixed typo here

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        // Corrected `req` to `res`
        throw new Error("Error generating tokens");  // You should handle this in the controller
    }
};

const registerUser = async (req, res) => {
    console.log(req.body);
    try {
        const { username, email, password } = req.body;

        if ([username, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const findUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (findUser) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }

        const user = await User.create({
            username: username,
            email: email,
            password: password
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({ message: "Something went wrong while registering the user" });
        }

        return res.status(201).json({
            success: true,
            data: createdUser,
            message: "Registration Successful"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username && !email) {
            return res.status(400).json({ message: "Username or Email is required" });
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure only in production
            sameSite: 'Strict'
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                user: loggedInUser,
                accessToken,
                refreshToken,
                message: "User logged in successfully"
            });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

const logOutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $unset: { refreshToken: 1 }
        });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure only in production
            sameSite: 'Strict'
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ success: true, message: "User logged out" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export {
    registerUser,
    logOutUser,
    loginUser
};
