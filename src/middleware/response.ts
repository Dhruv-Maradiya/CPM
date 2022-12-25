import { Request, Response, NextFunction } from "express";

const response = (_req: Request, res: Response, next: NextFunction) => {
  if (res.locals["data"] != undefined) {
    return res.status(200).json({
      data: res.locals["data"],
    });
  } else {
    return next();
  }
};

export default response;
