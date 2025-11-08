import type { Response, Request } from "express";
import { User } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from '../middlewares/generateToken.js'

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, email and password are required" });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const haspassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: haspassword,
        });

        await newUser.save();

        const token = generateToken(newUser?._id as string);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.status(201).json({ message: "User registered successfully" });


    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await User?.find({ email });

        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user?.password);

        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const token = generateToken(user?._id as string);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const logoutUser = (req: Request, res: Response): void => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: false,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "User logged out successfully" });
};

