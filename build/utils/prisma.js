"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const environment = process.env["ENVIRONMENT"];
const config = {};
if (environment === "development") {
    config.log = ["error", "info", "query", "warn"];
}
else if (environment === "debug") {
    config.log = ["error", "info", "query", "warn"];
}
const prisma = new client_1.PrismaClient(config);
exports.default = prisma;
