"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Movie_1 = __importDefault(require("./Movie"));
const Seat_1 = __importDefault(require("./Seat"));
const TheaterScreen_1 = __importDefault(require("./TheaterScreen"));
const Seat_2 = __importDefault(require("./Seat"));
const timeSlotSchema = new mongoose_1.Schema({
    movie: { type: mongoose_1.Schema.Types.ObjectId, ref: Movie_1.default, required: true },
    time: {
        hours: { type: Number, required: true, min: 0 },
        mins: { type: Number, required: true, min: 0, max: 59 },
        secs: { type: Number, required: true, min: 0, max: 59 },
    },
    theaterScreen: { type: mongoose_1.Schema.Types.ObjectId, ref: TheaterScreen_1.default, required: true },
    bookedSeats: [{ type: [Seat_2.default], ref: Seat_1.default }]
});
const TimeSlot = mongoose_1.default.model('TimeSlot', timeSlotSchema);
exports.default = TimeSlot;
