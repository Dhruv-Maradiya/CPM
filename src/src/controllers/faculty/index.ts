/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, faculty } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

const create = (data: Prisma.facultyUncheckedCreateInput) => {
  return new Promise<faculty>(async (resolve, reject) => {
    try {
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

export default {
  create,
  update,
  find,
  findMany,
};
