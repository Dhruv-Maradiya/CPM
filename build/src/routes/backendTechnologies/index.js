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
const utils_1 = require("../../../utils");
const index_1 = __importDefault(require("../../controllers/backendTechnologies/index"));
const index_2 = __importDefault(require("./validation/index"));
const router = (0, express_1.Router)();
router.post("/", (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, utils_1.validateSchema)(index_2.default.create, req.body, false);
        const body = req.body;
        const backendTechnology = yield index_1.default.create(body);
        next(backendTechnology);
    }
    catch (error) {
        next(error);
    }
}));
router.put("/", (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, utils_1.validateSchema)(index_2.default.update, req.body, true);
        const id = req.body.id;
        delete req.body.id;
        const body = req.body;
        const backendTechnology = yield index_1.default.update(body, id);
        next(backendTechnology);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/find", (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedQuery = yield (0, utils_1.validateSchema)(index_2.default.find, req.query, true);
        const id = validatedQuery["id"]; // validation goes here
        const backendTechnology = yield index_1.default.find(id);
        next(backendTechnology);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/findMany", (_req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const backendTechnologies = yield index_1.default.findMany();
        next(backendTechnologies);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
