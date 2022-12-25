/* eslint-disable no-async-promise-executor */
import prisma from "../../../utils/prisma";
import { Prisma, students } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index";

const create = (data: Prisma.studentsCreateInput) => {
  return new Promise<students>(async (resolve, reject) => {
    try {
      const student = await prisma.students.create({
        data: data,
      });
      return resolve(student);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.studentsCreateInput, id: number) => {
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

export default {
  create,
  update,
  find,
  findMany,
};
