"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const process_1 = __importDefault(require("process"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process_1.default.env["PORT"];
//
// ########## MIDDLEWARE ##########
//
// logging
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
// serving static files
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "../", "public")));
//
// ########## ROUTES ##########
//
//
// ########## MIDDLEWARE ##########
//
// exception middleware
// ########## SERVER ##########
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
