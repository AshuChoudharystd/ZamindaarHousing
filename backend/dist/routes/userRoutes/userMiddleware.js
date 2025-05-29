"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({
            msg: "Unauthorized access",
            status: "error"
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(403).json({
                msg: "Forbidden access",
                status: "error"
            });
            return;
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(403).json({
            msg: "Invalid token",
            status: "error"
        });
    }
};
exports.default = userMiddleware;
