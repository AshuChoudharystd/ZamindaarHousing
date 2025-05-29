"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var index_1 = require("./routes/index");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.Router());
app.use('/api/v1', index_1.default);
app.listen(3000, function () {
    console.log("Server is running at http://localhost:3000/api/v1/");
});
