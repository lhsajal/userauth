"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./src/routes/user"));
const body_parser_1 = require("body-parser");
require("dotenv/config");
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use('/user', user_1.default);
app.use((err, req, res, next) => {
    const response = { status: "failed", message: err.message, data: {} };
    res.status(500).json(response);
});
app.listen(process.env.PORT);
