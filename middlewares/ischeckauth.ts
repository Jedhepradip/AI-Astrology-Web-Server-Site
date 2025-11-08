import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
    interface Request {
        userId?: string | JwtPayload | null;
    }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            req.userId = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
        req.userId = decoded.id;
        next();

    } catch (err: any) {
        console.error("JWT verification failed:", err.message);
        res.clearCookie("authToken");
        req.userId = null;
        next();
    }
};