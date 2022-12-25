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
            const invitationForGroup = yield prisma_1.default.invitationForGroup.create({
                data: data,
            });
            return resolve(invitationForGroup);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const update = (data, id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const invitationForGroup = yield prisma_1.default.invitationForGroup.update({
                data: data,
                where: {
                    id: id,
                },
            });
            return resolve(invitationForGroup);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const findMany = (studentId) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const invitationForGroup = yield prisma_1.default.invitationForGroup.findMany({
                where: {
                    memberId: studentId,
                },
            });
            return resolve(invitationForGroup);
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
};
