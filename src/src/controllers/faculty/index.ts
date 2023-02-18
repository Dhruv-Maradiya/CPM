/* eslint-disable no-async-promise-executor */
import { hash, prisma, verify, sign } from "../../../utils/index.js";
import { Prisma, faculty } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "../../../exceptions/index.js";

type LoginResponse = {
  token: string;
  userId: number;
};
type FindManyArgs = {
  select?: Prisma.facultySelect;
  where?: Prisma.facultyWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.facultyOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindOneArgs = {
  select: Prisma.facultySelect;
  where: Prisma.facultyWhereUniqueInput;
};

const create = (data: Prisma.facultyUncheckedCreateInput) => {
  return new Promise<{
    number: string;
    employeeId: string;
    profilePicture: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    facultyRoles: {
      name: string;
      id: number;
    };
    id: number;
  }>(async (resolve, reject) => {
    try {
      data.password = await hash(data.password);
      const faculty = await prisma.faculty.create({
        data: data,
        select: {
          id: true,
          facultyRoles: {
            select: {
              id: true,
              name: true,
            },
          },
          email: true,
          employeeId: true,
          profilePicture: true,
          number: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return resolve(faculty);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.facultyUpdateInput, id: number) => {
  return new Promise<{
    number: string;
    employeeId: string;
    profilePicture: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    facultyRoles: {
      name: string;
      id: number;
    };
    id: number;
  }>(async (resolve, reject) => {
    try {
      const faculty = await prisma.faculty.update({
        data: data,
        where: {
          id: id,
        },
        select: {
          id: true,
          facultyRoles: {
            select: {
              id: true,
              name: true,
            },
          },
          email: true,
          employeeId: true,
          profilePicture: true,
          number: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return resolve(faculty);
    } catch (error) {
      reject(error);
    }
  });
};
const find = ({ select, where }: FindOneArgs) => {
  return new Promise<Partial<faculty>>(async (resolve, reject) => {
    try {
      const faculty = await prisma.faculty.findUnique({
        where: where,
        select: select,
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
const findMany = ({ take, skip, select, where, orderBy }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const faculties = await prisma.faculty.findMany({});
      const [faculties, count] = await Promise.all([
        prisma.faculty.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
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
