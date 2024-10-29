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
const Movie_1 = __importDefault(require("../Models/Movie"));
const TimeSlot_1 = __importDefault(require("../Models/TimeSlot"));
const Day_1 = __importDefault(require("../Models/Day"));
const router = (0, express_1.Router)();
const isAuth = (req, res, next) => {
    if (req.session && req.session.isAuth) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource' });
};
router.post('/addMovie', isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, releaseDate, duration: { hours, mins, secs }, genre } = req.body;
        if (yield Movie_1.default.findOne({ name })) {
            res.status(400).json({ message: 'Movie already exists' });
            return;
        }
        const newMovie = new Movie_1.default({
            name: name,
            releaseDate: releaseDate,
            duration: {
                hours,
                mins,
                secs
            },
            genre: genre
        });
        yield newMovie.save();
        res.status(201).json(newMovie);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding movie', error });
    }
}));
router.get('/getMovies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield Movie_1.default.find();
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error });
    }
}));
router.post('/addDate', isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.body;
        if (yield Day_1.default.findOne({ date })) {
            res.status(400).json({ message: 'Day already exists' });
            return;
        }
        const day = new Day_1.default({
            date: date
        });
        yield day.save();
        res.status(201).json(day);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding day', error });
    }
}));
router.post('/addtimeslot', isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, movieName, time: { hours, mins, secs }, } = req.body;
        const day = yield Day_1.default.findOne({ date });
        if (!day) {
            res.status(500).json("Date Doesnt Exist");
            return;
        }
        const movie = yield Movie_1.default.findOne({ name: movieName });
        if (!day) {
            res.status(500).json("movie Doesnt Exist");
            return;
        }
        const tempTimeSlot = yield TimeSlot_1.default.findOne({ time: {
                hours,
                mins,
                secs
            } });
        if (tempTimeSlot) {
            res.status(400).json({ message: 'TimeSlot in use' });
            return;
        }
        const timeslot = new TimeSlot_1.default({
            movie: movie === null || movie === void 0 ? void 0 : movie.id,
            time: {
                hours,
                mins,
                secs
            }
        });
        yield timeslot.save();
        day.slots.push(timeslot.id);
        yield day.save();
        res.status(201).json(day);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding timeslot', error });
    }
}));
router.get('/getday/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.params;
        const day = yield Day_1.default.findOne({ date }).populate({
            path: 'slots',
            populate: { path: 'movie', select: 'name' }
        });
        if (!day) {
            res.status(404).json({ message: "Day not found" });
            return;
        }
        const formattedDay = {
            date: day.date,
            slots: day.slots.map((slot) => ({
                movieName: slot.movie.name,
                time: slot.time,
            })),
        };
        res.json(formattedDay);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching Day', error });
    }
}));
exports.default = router;
