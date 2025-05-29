import express from 'express';
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface AuthenticatedRequest extends Request{
    userId?:string
}

const userMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({
            msg: "Unauthorized access",
            status: "error"
        });
        return;
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {userId:string};
        if (!decoded) {
            res.status(403).json({
                msg: "Forbidden access",
                status: "error"
            });
            return;
        }
        req.userId = decoded.userId

        next();
    } catch (error) {
        res.status(403).json({
            msg: "Invalid token",
            status: "error"
        });
    }
};

export default userMiddleware;
export type {AuthenticatedRequest};