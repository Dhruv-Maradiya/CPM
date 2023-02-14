/* eslint-disable no-async-promise-executor */
import { hash, prisma, verify, sign } from "../../../utils/index.js";
import { Prisma, faculty } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "../../../exceptions/index.js";

type LoginResponse = {
  token: string;
  userId: number;
};
type FindManyArgs = {
  take?: number;
  skip?: number;
};

const create = (data: Prisma.facultyUncheckedCreateInput) => {
  return new Promise<faculty>(async (resolve, reject) => {
    try {
      data.password = await hash(data.password);
      const faculty = await prisma.faculty.create({
        data: data,
      });
      return resolve(faculty);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.facultyUpdateInput, id: number) => {
  return new Promise<faculty>(async (resolve, reject) => {
    try {
      const faculty = await prisma.faculty.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(faculty);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<faculty>(async (resolve, reject) => {
    try {
      const faculty = await prisma.faculty.findUnique({
        where: {
          id: id,
        },
      });
      if (!faculty) {
        throw new NotFoundError("faculty not found");
      }
      return resolve(faculty);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = ({ take, skip }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const faculties = await prisma.faculty.findMany({});
      const [faculties, count] = await Promise.all([
        prisma.faculty.findMany({
          take: take ?? 10,
          skip: skip ?? 0,
        }),
        prisma.faculty.count(),
      ]);
      return resolve({ faculties: faculties, count: count });
    } catch (error) {
      reject(error);
    }
  });
};
const login = (employeeId: string, password: string) => {
  return new Promise<LoginResponse>(async (resolve, reject) => {
    try {
      const faculty = await prisma.faculty.findUnique({
        where: {
          employeeId: employeeId,
        },
        select: {
          password: true,
          employeeId: true,
          id: true,
          isBlocked: true,
          facultyRoles: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!faculty) {
        throw new ForbiddenError("invalid credentials");
      }

      if (faculty.isBlocked) {
        throw new ForbiddenError("faculty is blocked");
      }

      const isCorrectPassword = await verify(password, faculty.password);

      if (isCorrectPassword === false) {
        throw new ForbiddenError("invalid credentials");
      }

      const token = await sign({
        identifier: faculty.employeeId,
        id: faculty.id,
        type: "FACULTY",
      });

      return resolve({ token, userId: faculty.id });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  create,
  update,
  find,
  findMany,
  login,
};
