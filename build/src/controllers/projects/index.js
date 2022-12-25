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
/* eslint-disable no-async-promise-executor */
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const index_1 = require("../../../exceptions/index");
const create = (data) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const project = yield prisma_1.default.projects.create({
                data: data,
            });
            return resolve(project);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const update = (data, id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const project = yield prisma_1.default.projects.update({
                data: data,
                where: {
                    id: id,
                },
            });
            return resolve(project);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const find = (id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const project = yield prisma_1.default.projects.findUnique({
                where: {
                    id: id,
                },
            });
            if (!project) {
                throw new index_1.NotFoundError("project not found");
            }
            return resolve(project);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const findMany = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const projects = yield prisma_1.default.projects.findMany({});
            return resolve(projects);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.default = {
    create,
    update,
    find,
    findMany,
};
