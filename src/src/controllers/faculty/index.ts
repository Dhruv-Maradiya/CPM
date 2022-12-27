/* eslint-disable no-async-promise-executor */
import { hash, prisma, verify, sign } from "../../../utils/index.js";
import { Prisma, faculty } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "../../../exceptions/index.js";

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
const findMany = () => {
  return new Promise<faculty[]>(async (resolve, reject) => {
    try {
      const faculties = await prisma.faculty.findMany({});
      return resolve(faculties);
    } catch (error) {
      reject(error);
    }
  });
};
const login = (employeeId: string, password: string) => {
  return new Promise<string>(async (resolve, reject) => {
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

      const token = sign({
        employeeId: faculty.employeeId,
        id: faculty.id,
      });

      return resolve(token);
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
