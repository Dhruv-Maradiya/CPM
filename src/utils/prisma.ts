import { PrismaClient, Prisma } from "@prisma/client";

const environment = process.env["ENVIRONMENT"] as string;

interface Config {
  log?: Prisma.LogLevel[];
}

const config: Config = {};

if (environment === "development") {
  config.log = ["error", "info", "query", "warn"];
} else if (environment === "debug") {
  config.log = ["error", "info", "query", "warn"];
}

const prisma = new PrismaClient(config);

export default prisma;
