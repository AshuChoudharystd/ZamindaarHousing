"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({
            msg: "Unauthorized access",
            status: "error"
        });
        return;
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        res.status(403).json({
            msg: "Forbidden access",
            status: "error"
        });
        return;
    }
    else {
        next();
    }
};
exports.default = adminMiddleware;
