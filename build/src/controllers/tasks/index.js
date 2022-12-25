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
const create = (data) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const task = yield prisma_1.default.tasks.create({
                data: data,
            });
            return resolve(task);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const update = (data, id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const task = yield prisma_1.default.tasks.update({
                data: data,
                where: {
                    id: id,
                },
            });
            return resolve(task);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const findMany = (studentId) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tasks = yield prisma_1.default.tasks.findMany({
                where: {
                    assignedToParticipantId: studentId,
                },
            });
            return resolve(tasks);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const findManyByProject = (projectId) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tasks = yield prisma_1.default.tasks.findMany({
                where: {
                    projectId: projectId,
                },
                include: {
                    assignedToParticipant: true,
                },
            });
            return resolve(tasks);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const findManyByProjectFaculty = (facultyId) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tasks = yield prisma_1.default.tasks.findMany({
                where: {
                    project: {
                        projectGuideMapping: {
                            some: {
                                guideId: facultyId,
                            },
                        },
                    },
                },
                include: {
                    assignedToParticipant: true,
                    project: true,
                },
            });
            return resolve(tasks);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.default = {
    create,
    update,
    findMany,
    findManyByProject,
    findManyByProjectFaculty,
};
