"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../../utils");
const create = utils_1.yup
    .object()
    .shape({
    name: utils_1.yup.string().required(),
})
    .noUnknown(true)
    .strict(true);
const update = utils_1.yup
    .object()
    .shape({
    id: utils_1.yup.number().required(),
    name: utils_1.yup.string().required(),
})
    .noUnknown(true)
    .strict(true);
const find = utils_1.yup.object().shape({ id: utils_1.yup.number().required() });
exports.default = {
    create,
    update,
    find,
};
