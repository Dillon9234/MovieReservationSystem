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
const Theater_1 = __importDefault(require("../Models/Theater"));
const Seat_1 = __importDefault(require("../Models/Seat"));
const TheaterScreen_1 = __importDefault(require("../Models/TheaterScreen"));
const router = (0, express_1.Router)();
const isAuth = (req, res, next) => {
    if (req.session && req.session.isAuth) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource' });
};
router.post('/addTheater', isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Id, name } = req.body;
        if (yield Theater_1.default.findOne({ name: name })) {
            res.status(400).json({ message: 'Theater already exists' });
            return;
        }
        const newTheater = new Theater_1.default({
            Id: Id,
            name: name,
        });
        yield newTheater.save();
        res.status(201).json(newTheater);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding Theater', error });
    }
}));
router.get('/getTheater', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const theaters = yield Theater_1.default.find();
        res.json(theaters);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching theaters', error });
    }
}));
router.post('/addSeats', isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { row, column } = req.body;
        if (yield Seat_1.default.findOne({ row: row, column: column })) {
            res.status(400).json({ message: 'Seat already exists' });
            return;
        }
        const seat = new Seat_1.default({
            row: row,
            column: column
        });
        yield seat.save();
        res.status(201).json(seat);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding Seat', error });
    }
}));
router.post('/addTheaterScreen', isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { theaterId, seatingLayout } = req.body;
        const theater = yield Theater_1.default.findOne({ Id: theaterId });
        if (!theater) {
            res.status(500).json("Theater Doesnt Exist");
            return;
        }
        const seating = [];
        for (const [rowIndex, columns] of seatingLayout.entries()) {
            for (const colIndex of columns) {
                const seat = yield Seat_1.default.findOne({ row: rowIndex + 1, column: colIndex });
                if (!seat) {
                    res.status(500).json({ message: 'Invalid Seating' });
                    return;
                }
                seating.push(seat);
            }
        }
        const newTheaterScreen = new TheaterScreen_1.default({
            Id: theaterId,
            seating,
        });
        yield newTheaterScreen.save();
        res.status(201).json(newTheaterScreen);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding TheaterScreen', error });
    }
}));
router.get('/getTheaterScreen', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const theaterScreens = yield TheaterScreen_1.default.find()
            .populate('theater')
            .populate('seating');
        res.json(theaterScreens);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching theaters', error });
    }
}));
exports.default = router;
