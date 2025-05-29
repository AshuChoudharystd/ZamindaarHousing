import express from 'express';
import {Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';



const adminMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({
            msg: "Unauthorized access",
            status: "error"
        });
        return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {userId:string};
    if (!decoded) {
        res.status(403).json({
            msg: "Forbidden access",
            status: "error"
        });
        return;
    } else {
        next();
    }
}

export default adminMiddleware;