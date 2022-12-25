"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../../utils");
const create = utils_1.yup
    .object()
    .shape({
    roleId: utils_1.yup.number().required(),
    employeeId: utils_1.yup.string().max(15).required(),
    name: utils_1.yup.string().max(255).required(),
    password: utils_1.yup
        .string()
        .required()
        .min(8, "password must be at least 8 characters")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "must contain at least one uppercase letter, one lowercase letter, one digit, and one special"),
    email: utils_1.yup.string().email().required(),
    number: utils_1.yup
        .string()
        .matches(/a/, "number must be a valid number")
        .required(),
    createdById: utils_1.yup.number().required(),
})
    .noUnknown(true)
    .strict(true);
const update = utils_1.yup
    .object()
    .shape({
    id: utils_1.yup.number().required(),
    roleId: utils_1.yup.number().optional(),
    employeeId: utils_1.yup.string().max(15).optional(),
    name: utils_1.yup.string().max(255).optional(),
    email: utils_1.yup.string().email().optional(),
    number: utils_1.yup
        .string()
        .matches(/a/, "number must be a valid number")
        .optional(),
})
    .noUnknown(true)
    .strict(true);
const find = utils_1.yup.object().shape({ id: utils_1.yup.number().required() });
exports.default = {
    create,
    update,
    find,
};
