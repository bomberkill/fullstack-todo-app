import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, {IUser} from "../models/User";

const generateToken = (id: string): string => {
    const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
    return  jwt.sign({ id }, jwtSecret, {
        expiresIn: "2h",
    })
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const userExists: IUser | null = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: "User already exists" });
        }

        const user: IUser = await User.create({
            email,
            password,
            name,
        });

        if (!user) {
            res.status(500).json({ message: "User creation failed" });
        }

        res.status(201).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            token: generateToken(user._id as string),
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error during registration', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred during registration' });
        }
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const user: IUser | null = await User.findOne({ email }).select("+password");

        if (user && user.password && (await user.comparePassword(password))) {
            // User found and password matches
            res.json({
              _id: user._id,
              email: user.email,
              createdAt: user.createdAt,
              token: generateToken(user._id as string),
            });
        } else {
            // User not found or password doesn't match
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error during login', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred during login' });
        }
    }
}