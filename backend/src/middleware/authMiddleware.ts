import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

interface JwtPayload {
    id: string;
}
declare global {
    namespace Express {
      interface Request {
        user?: IUser;
      }
    }
  }
  

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            res.status(500).json({ message: "JWT secret is not defined" });
            return;
        }
        try {
            const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                res.status(401).json({ message: "Not authorized, user not found" });
                return;
            }
            next();
        }
        catch (error) {
            console.error("JWT verification failed:", error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        return;
    }
}