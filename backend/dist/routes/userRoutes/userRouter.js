"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../generated/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userMiddleware_1 = __importDefault(require("./userMiddleware"));
const prisma = new prisma_1.PrismaClient();
const userRouter = express_1.default.Router();
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        return yield bcrypt_1.default.hash(password, saltRounds);
    });
}
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        res.status(400).json({
            msg: "Please provide all required fields",
            status: "error",
        });
        return;
    }
    const hashedPassword = yield hashPassword(password);
    if (!hashedPassword) {
        res.status(500).json({
            msg: "Password hashing failed",
            status: "error",
        });
        return;
    }
    try {
        const user = yield prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
            },
        });
        if (!user) {
            res.status(400).json({
                msg: "User creation failed",
                status: "error",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(201).json({
            msg: "User created successfully",
            status: "success",
            token: token,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal server error",
            status: "error",
        });
        return;
    }
}));
function verifyPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, hashedPassword);
    });
}
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            msg: "Please provide all required fields",
            status: "error",
        });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            res.status(401).json({
                msg: "Invalid email",
                status: "error",
            });
            return;
        }
        if (!(yield verifyPassword(password, user.password))) {
            res.status(401).json({
                msg: "Invalid email or password",
                status: "error",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(200).json({
            msg: "Login successful",
            status: "success",
            token: token,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal server error",
            status: "error",
        });
        return;
    }
}));
userRouter.get('/site/:id', userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const siteId = parseInt(req.params.id, 10);
    if (isNaN(siteId)) {
        res.status(400).json({
            msg: "Invalid site ID",
            status: "error",
        });
        return;
    }
    try {
        const site = yield prisma.site.findUnique({
            where: { id: siteId },
        });
        if (!site) {
            res.status(404).json({
                msg: "Site not found",
                status: "error",
            });
            return;
        }
        res.status(200).json({
            msg: "Site fetched successfully",
            status: "success",
            data: site,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal server error",
            status: "error",
        });
    }
}));
userRouter.put("/site/purchase/:id", userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const siteId = parseInt(req.params.id);
    const userId = req.userId;
    if (isNaN(siteId)) {
        res.status(400).json({
            msg: "Invalid site ID",
            status: "error",
        });
        return;
    }
    try {
        const site = yield prisma.site.update({
            where: {
                id: siteId
            },
            data: {
                sold: true
            }
        });
        if (!site) {
            res.status(400).json({
                msg: "error buying the property!!",
                status: 400
            });
            return;
        }
        if (!userId) {
            res.status(500).json({
                msg: "Internal server Error!!",
                status: 500
            });
            return;
        }
        const purchase = yield prisma.purchase.create({
            data: {
                userId: userId,
                siteId: site.id,
                priceSite: site.price,
                productId: 1
            }
        });
        if (!purchase) {
            res.status(500).json({
                msg: "Internal Server error!!",
                status: 500
            });
            return;
        }
        res.status(200).json({
            msg: "Purhcase Info",
            status: "success",
            purchase: purchase
        });
        return;
    }
    catch (err) {
        res.status(500).json({
            msg: "fatal server error",
            status: 500
        });
        return;
    }
}));
userRouter.get("/purchase-history", userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        let purchase = yield prisma.purchase.findMany({
            where: {
                userId: userId
            }
        });
        if (!purchase) {
            res.status(400).json({
                msg: "Unable to fetch data!!",
                status: 'failure',
            });
            return;
        }
        res.status(200).json({
            msg: "Data fetched!!",
            status: "success",
            purchases: purchase
        });
        return;
    }
    catch (err) {
        res.status(500).json({
            msg: "internal server error",
            status: "failure"
        });
        return;
    }
}));
userRouter.get('/search/:text', userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = req.params.text;
    if (!text) {
        res.status(500).json({
            msg: "cannot find the entered search text",
            status: "failure",
        });
        return;
    }
    try {
        const site = yield prisma.site.findMany({
            where: {
                place: {
                    contains: text,
                    mode: 'insensitive'
                }
            }
        });
        if (!site) {
            res.status(400).json({
                msg: "unable to load!!",
                status: "failure"
            });
            return;
        }
        res.status(200).json({
            msg: `sites with place like ${text}`,
            status: "success",
            sites: site
        });
    }
    catch (err) {
        res.status(500).json({
            msg: "internal server error",
            status: "failure",
            error: err
        });
        return;
    }
}));
exports.default = userRouter;
