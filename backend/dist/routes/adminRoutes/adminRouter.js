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
const express_1 = __importDefault(require("express"));
const prisma_1 = require('@prisma/client');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminMiddlewae_1 = __importDefault(require("./adminMiddlewae"));
const multer_1 = __importDefault(require("multer"));
const prisma = new prisma_1.PrismaClient();
const adminRouter = express_1.default.Router();
adminRouter.use(express_1.default.json());
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        return yield bcrypt_1.default.hash(password, saltRounds);
    });
}
adminRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        res.status(400).json({
            msg: 'Please provide all required fields',
            status: 'error'
        });
        return;
    }
    const hashedPassword = yield hashPassword(password);
    if (!hashedPassword) {
        res.status(500).json({
            msg: 'Password hashing failed',
            status: 'error'
        });
        return;
    }
    try {
        const admin = yield prisma.admin.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name
            }
        });
        if (!admin) {
            res.status(400).json({
                msg: 'Admin creation failed',
                status: 'error'
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id }, process.env.JWT_SECRET);
        res.status(201).json({
            msg: 'Admin created successfully',
            status: 'success',
            token: token
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Internal server error',
            status: 'error'
        });
        return;
    }
}));
function verifyPassword(plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
}
adminRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            msg: 'Please provide all required fields',
            status: 'error'
        });
        return;
    }
    try {
        const admin = yield prisma.admin.findUnique({
            where: { email: email }
        });
        if (!admin) {
            res.status(401).json({
                msg: 'Invalid',
                status: 'error'
            });
            return;
        }
        if (!(yield verifyPassword(password, admin.password))) {
            res.status(401).json({
                msg: 'Invalid email or password',
                status: 'error'
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id }, process.env.JWT_SECRET);
        res.status(200).json({
            msg: 'Login successful',
            status: 'success',
            token: token
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Internal server error',
            status: 'error'
        });
        return;
    }
}));
const storage = multer_1.default.diskStorage({
    destination: "uploads",
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
});
adminRouter.post("/add-sites", adminMiddlewae_1.default, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { place, description, price, contactEmail, contactPhone } = req.body;
    let image = `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`;
    if (!place || !description || !price || !image || !contactEmail || !contactPhone) {
        res.status(400).json({
            msg: 'Please provide all required fields',
            status: 'error'
        });
        return;
    }
    try {
        const site = yield prisma.site.create({
            data: {
                place: place,
                description: description,
                price: parseFloat(price),
                imageUrl: image,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
                sold: false
            }
        });
        if (!site) {
            res.status(400).json({
                msg: 'Site creation failed',
                status: 'error'
            });
            return;
        }
        res.status(201).json({
            msg: 'Site created successfully',
            status: 'success',
            data: site
        });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Internal server error',
            status: 'error'
        });
        return;
    }
}));
exports.default = adminRouter;
