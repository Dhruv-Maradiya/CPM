"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../../utils");
const create = utils_1.yup
    .object()
    .shape({
    sem: utils_1.yup.number().required(),
    year: utils_1.yup.number().required(),
    maximumGroupMember: utils_1.yup.number().required(),
})
    .noUnknown(true)
    .strict(true);
const update = utils_1.yup
    .object()
    .shape({
    id: utils_1.yup.number().required(),
    sem: utils_1.yup.number().optional(),
    year: utils_1.yup.number().optional(),
    maximumGroupMember: utils_1.yup.number().optional(),
})
    .noUnknown(true)
    .strict(true);
const find = utils_1.yup.object().shape({ id: utils_1.yup.number().required() });
exports.default = {
    create,
    update,
    find,
};
