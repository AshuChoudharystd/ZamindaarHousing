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
const userRouter_1 = __importDefault(require("./userRoutes/userRouter"));
const adminRouter_1 = __importDefault(require("./adminRoutes/adminRouter"));
const prisma_1 = require('@prisma/client');;
const prisma = new prisma_1.PrismaClient();
const indexRouter = express_1.default.Router();
indexRouter.get('/working', (req, res) => {
    res.status(200).json({
        msg: "Routing is working",
        status: "success"
    });
});
indexRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let siteList = yield prisma.site.findMany({
            where: {
                sold: false
            }
        });
        if (!siteList || siteList.length === 0) {
            res.status(404).json({
                msg: "No sites found",
                status: "error"
            });
            return;
        }
        res.status(200).json({
            msg: "Site list fetched successfully",
            status: "success",
            data: siteList
        });
        return;
    }
    catch (err) {
        res.status(500).json({
            msg: "Error fetching site list",
            status: "error"
        });
        return;
    }
}));
indexRouter.use('/user', userRouter_1.default);
indexRouter.use('/admin', adminRouter_1.default);
exports.default = indexRouter;
