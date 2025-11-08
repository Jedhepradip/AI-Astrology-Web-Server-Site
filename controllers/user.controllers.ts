import type { Request, Response } from "express";
import { User } from "../Models/user.model.js";

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
}

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user =
            await User.findByIdAndDelete(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}