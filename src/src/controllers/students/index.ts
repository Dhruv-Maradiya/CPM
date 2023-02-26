/* eslint-disable no-async-promise-executor */
import { hash, prisma, sign, verify } from "../../../utils/index.js";
import { Prisma, students } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "../../../exceptions/index.js";

type LoginResponse = {
  token: string;
  userId: number;
};
type FindManyResponse = {
  students: students[];
  count: number;
};

type FindManyArgs = {
  select?: Prisma.studentsSelect;
  where?: Prisma.studentsWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.studentsOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindOneArgs = {
  select: Prisma.studentsSelect;
  where: Prisma.studentsWhereUniqueInput;
};

const create = (data: Prisma.studentsUncheckedCreateInput) => {
  return new Promise<{
    number: string;
    name: string;
    semester: number;
    enrollmentNo: string;
    email: string;
    id: number;
    profilePicture: string | null;
    branch: {
      name: string;
      id: number;
      displayName: string;
    };
  }>(async (resolve, reject) => {
    try {
      data.password = await hash(data.password);
      const student = await prisma.students.create({
        data: data,
        select: {
          id: true,
          enrollmentNo: true,
          profilePicture: true,
          name: true,
          email: true,
          branch: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
          number: true,
          semester: true,
        },
      });
      return resolve(student);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.studentsUpdateInput, id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.password !== undefined && data.password !== null) {
        data.password = await hash(data.password as string);
      }

      const student = await prisma.students.update({
        data: data,
        where: {
          id: id,
        },
        select: {
          id: true,
          enrollmentNo: true,
          profilePicture: true,
          name: true,
          email: true,
          branch: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
          number: true,
          semester: true,
        },
      });
      return resolve(student);
    } catch (error) {
      reject(error);
    }
  });
};
const find = ({ select, where }: FindOneArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const student = await prisma.students.findUnique({
        where: where,
        select: select,
      });
      if (!student) {
        throw new NotFoundError("student not found");
      }
      return resolve(student);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = ({ take, skip, where, select, orderBy }: FindManyArgs) => {
  return new Promise<FindManyResponse>(async (resolve, reject) => {
    try {
      const [students, count] = await Promise.all([
        prisma.students.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.students.count(),
      ]);
      return resolve({ students, count });
    } catch (error) {
      reject(error);
    }
  });
};
const login = (enrollmentNo: string, password: string) => {
  return new Promise<LoginResponse>(async (resolve, reject) => {
    try {
      const student = await prisma.students.findUnique({
        where: {
          enrollmentNo: enrollmentNo,
        },
        select: {
          password: true,
          enrollmentNo: true,
          id: true,
        },
      });

      if (!student) {
        throw new ForbiddenError("invalid credentials");
      }

      const isCorrectPassword = await verify(password, student.password);

      if (isCorrectPassword === false) {
        throw new ForbiddenError("invalid credentials");
      }

      const token = await signToken(student.enrollmentNo, student.id);

      return resolve({ token, userId: student.id });
    } catch (error) {
      reject(error);
    }
  });
};
const signToken = async (enrollmentNo: string, id: number): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const token = await sign({
        identifier: enrollmentNo,
        id: id,
        type: "STUDENT",
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
  signToken,
};
