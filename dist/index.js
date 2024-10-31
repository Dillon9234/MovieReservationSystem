"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./api/User"));
const Movie_1 = __importDefault(require("./api/Movie"));
const Theater_1 = __importDefault(require("./api/Theater"));
const Book_1 = __importDefault(require("./api/Book"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => {
    console.log("DB Connected");
})
    .catch((err) => console.error('MongoDB connection error:', err));
const MongoDBSession = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new MongoDBSession({
    uri: process.env.MONGODB_URI,
    collection: 'MySessions',
});
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'Some Secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SIGN));
app.use('/user', User_1.default);
app.use('/movie', Movie_1.default);
app.use('/theater', Theater_1.default);
app.use('/book', Book_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
