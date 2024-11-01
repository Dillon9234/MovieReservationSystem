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
const express_1 = require("express");
const TheaterScreen_1 = __importDefault(require("../Models/TheaterScreen"));
const TimeSlot_1 = __importDefault(require("../Models/TimeSlot"));
const Movie_1 = __importDefault(require("../Models/Movie"));
const router = (0, express_1.Router)();
const isAuth = (req, res, next) => {
    if (req.session && req.session.isAuth) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource' });
};
router.post('/book', isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, movieName, time: { hours, mins, secs, }, theaterScreenId, seatingLayout } = req.body;
        const hasDuplicates = seatingLayout.some((seat, index) => seatingLayout.findIndex((s) => s.row === seat.row && s.column === seat.column) !== index);
        if (hasDuplicates) {
            res.status(400).json({ message: 'Duplicate seats detected in the request' });
            return;
        }
        const theaterScreen = yield TheaterScreen_1.default.findOne({ Id: theaterScreenId });
        if (!theaterScreen) {
            res.status(500).json({ message: 'Error fetching theater screen' });
            return;
        }
        const movie = yield Movie_1.default.findOne({ name: movieName });
        if (!movie) {
            res.status(500).json({ message: 'Error fetching Movie' });
            return;
        }
        const timeslot = yield TimeSlot_1.default.findOne({ date: date, movie: movie, time: { hours, mins, secs }, theaterScreen: theaterScreen });
        if (!timeslot) {
            res.status(500).json({ message: 'Error fetching timeslot' });
            return;
        }
        const seating = [];
        const existingBookedSeats = timeslot.bookedSeats || [];
        for (const row of seatingLayout) {
            const { row: rowNumber, column } = row;
            const seatExists = existingBookedSeats.some(seat => seat.row === rowNumber && seat.column === column);
            if (!seatExists) {
                if (req.signedCookies.Username) {
                    seating.push({ row: rowNumber, column: column, UserName: req.signedCookies.Username });
                }
                else {
                    res.status(500).json({ message: 'User cookie doesnt exist' });
                    return;
                }
            }
            else {
                res.status(500).json({ message: `Seat already booked: Row ${rowNumber}, Column ${column}` });
                return;
            }
        }
        timeslot.bookedSeats.push(...seating);
        yield timeslot.save();
        res.status(200).json({ message: 'Seats Booked' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error booking seats', error });
    }
}));
//router.get('/getMovieScreenSlots')
exports.default = router;
