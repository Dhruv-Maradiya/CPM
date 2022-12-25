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
const create = (data, transaction) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let db = prisma_1.default;
            if (transaction) {
                db = transaction;
            }
            const group = yield db.groups.create({
                data: data,
            });
            return resolve(group);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const update = (data, id, transaction) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let db = prisma_1.default;
            if (transaction) {
                db = transaction;
            }
            const group = yield db.groups.update({
                data: data,
                where: {
                    id: id,
                },
            });
            return resolve(group);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const find = (id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const group = yield prisma_1.default.groups.findUnique({
                where: {
                    id: id,
                },
            });
            if (!group) {
                throw new index_1.NotFoundError("group not found");
            }
            return resolve(group);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const findMany = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const groups = yield prisma_1.default.groups.findMany({});
            return resolve(groups);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const assignLeader = (groupId, studentId, transaction) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let db = prisma_1.default;
            if (transaction) {
                db = transaction;
            }
            const groupDetails = yield db.groups.findUnique({
                where: {
                    id: groupId,
                },
                select: {
                    groupParticipants: {
                        select: {
                            id: true,
                            studentId: true,
                            role: true,
                        },
                    },
                    academic: {
                        select: {
                            maximumGroupMember: true,
                        },
                    },
                },
            });
            if (!groupDetails) {
                throw new index_1.NotFoundError("group not found");
            }
            if (groupDetails.academic.maximumGroupMember ===
                groupDetails.groupParticipants.length) {
                throw new index_1.MethodNotAllowed("there's already maximum number of participants in group");
            }
            let isLeaderExists = false;
            for (let i = 0; i < groupDetails.groupParticipants.length; i++) {
                if (((_a = groupDetails.groupParticipants[i]) === null || _a === void 0 ? void 0 : _a.role) === "LEADER") {
                    isLeaderExists = true;
                }
            }
            if (isLeaderExists) {
                throw new index_1.NotFoundError("group is already assigned a leader");
            }
            const studentDetails = yield db.students.findUnique({
                where: {
                    id: studentId,
                },
                select: {
                    semester: true,
                },
            });
            if (!studentDetails) {
                throw new index_1.NotFoundError("student not found");
            }
            yield db.groupParticipants.create({
                data: {
                    groupId: groupId,
                    studentId: studentId,
                    role: "LEADER",
                    semester: studentDetails.semester,
                },
            });
            resolve();
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
    assignLeader,
};
