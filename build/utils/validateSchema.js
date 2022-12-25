"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const validateSchema = (schema, data, cast) => {
    return new Promise((resolve, reject) => {
        if (cast) {
            data = schema.cast(data);
        }
        Promise.resolve(schema.validate(data, {
            abortEarly: true,
            stripUnknown: true,
        }))
            .then((data) => {
            return resolve(data);
        })
            .catch((error) => {
            console.log(error);
            const newError = new exceptions_1.ValidationError(error.message);
            return reject(newError);
        });
    });
};
exports.default = validateSchema;
