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
const TheaterScreen_1 = __importDefault(require("../Models/TheaterScreen"));
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
router.post('/addTimeSlot', isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, movieName, time: { hours, mins, secs }, theaterScreenId } = req.body;
        const movie = yield Movie_1.default.findOne({ name: movieName });
        if (!movie) {
            res.status(500).json("movie Doesnt Exist");
            return;
        }
        const theaterScreen = yield TheaterScreen_1.default.findOne({ Id: theaterScreenId });
        if (!theaterScreen) {
            res.status(500).json("Theater Screen Doesnt Exist");
            return;
        }
        const tempTimeSlot = yield TimeSlot_1.default.findOne({ date: date, time: {
                hours,
                mins,
                secs
            },
            theaterScreen: theaterScreen
        });
        if (tempTimeSlot) {
            res.status(400).json({ message: 'TimeSlot in use' });
            return;
        }
        const timeslot = new TimeSlot_1.default({
            date: date,
            movie: movie,
            time: {
                hours,
                mins,
                secs
            },
            theaterScreen: theaterScreen
        });
        yield timeslot.save();
        res.status(201).json(timeslot);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding timeslot', error });
    }
}));
router.get('/getDay/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.params;
        const timeslots = yield TimeSlot_1.default.find({ date: date })
            .populate('movie', 'name')
            .populate('theaterScreen', 'Id');
        if (!timeslots.length) {
            res.status(404).json({ message: "No timeslots found for the specified date" });
            return;
        }
        const formattedDay = {
            date,
            slots: timeslots.map((slot) => ({
                movieName: slot.movie.name,
                time: slot.time,
                theaterId: slot.theaterScreen.Id
            })),
        };
        res.json(formattedDay);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching timeslots for the day', error });
    }
}));
router.get('/getTimeslot', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, hours, mins, secs, theaterScreenId } = req.query;
        const theaterScreen = yield TheaterScreen_1.default.findOne({ Id: theaterScreenId });
        if (!theaterScreen) {
            res.status(404).json({ message: 'Theater screen not found' });
            return;
        }
        const timeslot = yield TimeSlot_1.default.findOne({ date: date,
            time: { hours: Number(hours), mins: Number(mins), secs: Number(secs) },
            theaterScreen: theaterScreen,
        }).populate('movie');
        if (!timeslot) {
            res.status(404).json({ message: 'Time slot not found' });
            return;
        }
        const formattedTimeslot = {
            movie: timeslot.movie,
            date: timeslot.date,
            time: timeslot.time,
            seating: theaterScreen.seating,
            bookedSeats: timeslot.bookedSeats,
        };
        res.status(200).json(formattedTimeslot);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching time slot', error });
    }
}));
exports.default = router;
