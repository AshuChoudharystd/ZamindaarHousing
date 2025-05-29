"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var indexRouter = express_1.default.Router();
indexRouter.get('/working', function (req, res) {
    res.status(200).json({
        msg: "Routing is working",
        status: "success"
    });
});
exports.default = indexRouter;
