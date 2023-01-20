/* eslint-disable no-async-promise-executor */
import { hash, prisma, sign, verify } from "../../../utils/index.js";
import { Prisma, students } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "../../../exceptions/index.js";

const create = (data: Prisma.studentsUncheckedCreateInput) => {
  return new Promise<students>(async (resolve, reject) => {
    try {
      data.password = await hash(data.password);
      const student = await prisma.students.create({
        data: data,
      });
      return resolve(student);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.studentsUpdateInput, id: number) => {
  return new Promise<students>(async (resolve, reject) => {
    try {
      const student = await prisma.students.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(student);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<students>(async (resolve, reject) => {
    try {
      const student = await prisma.students.findUnique({
        where: {
          id: id,
        },
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
const findMany = () => {
  return new Promise<students[]>(async (resolve, reject) => {
    try {
      const students = await prisma.students.findMany({});
      return resolve(students);
    } catch (error) {
      reject(error);
    }
  });
};
const login = (enrollmentNo: string, password: string) => {
  return new Promise<string>(async (resolve, reject) => {
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

      return resolve(token);
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
