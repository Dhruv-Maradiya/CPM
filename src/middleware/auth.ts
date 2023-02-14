import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../exceptions/index.js";
import { jwtVerify, prisma } from "../utils/index.js";

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction,
  isAuthRequired = true
) => {
  try {
    if (
      (req.headers.authorization == null ||
        req.headers.authorization == undefined ||
        req.headers.authorization == "") &&
      isAuthRequired
    ) {
      throw new UnauthorizedError("Unauthorized");
    }
    const authToken = req.headers.authorization?.split(" ")[1];

    if (
      (authToken == undefined || authToken == null || authToken == "") &&
      isAuthRequired
    ) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (authToken !== null && authToken !== undefined && authToken !== "") {
      const user = await jwtVerify(authToken);
      let userDetails;

      if (user.type === "STUDENT") {
        userDetails = await prisma.students.findUnique({
          where: {
            enrollmentNo: user.identifier,
          },
          select: {
            id: true,
            name: true,
            enrollmentNo: true,
          },
        });
      } else {
        userDetails = await prisma.faculty.findUnique({
          where: {
            employeeId: user.identifier,
          },
          select: {
            id: true,
            name: true,
            employeeId: true,
            facultyRoles: {
              select: {
                name: true,
              },
            },
          },
        });
      }

      res.locals["user"] = { type: user.type, userDetails };
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
