import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ApplicationError, DuplicationError } from "../exceptions/index.js";

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (process.env["NODE_ENV"] === "development") {
    console.error(err);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.status).json({
      status: "error",
      name: err.name,
      message: err.message,
    });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const error = new DuplicationError(
        `Duplicate entry for ${err?.meta?.["target"]}`
      );
      return res.status(error.status).json({
        status: "error",
        name: error.name,
        message: error.message,
      });
    }
    const error = new ApplicationError(err.message);
    return res.status(error.status).json({
      status: "error",
      message: err.meta?.["message"] ?? "Something went wrong",
      name: error.name,
    });
  } else {
    return res.status(500).json({
      status: "error",
      name: "InternalServerError",
      message: "Internal server error",
    });
  }
};

export default errorHandler;
