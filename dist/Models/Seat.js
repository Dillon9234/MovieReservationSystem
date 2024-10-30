"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const seatSchema = new mongoose_1.Schema({
    row: { type: Number, required: true },
    column: { type: Number, required: true }
});
exports.default = seatSchema;
