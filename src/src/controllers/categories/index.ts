/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, category } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

const create = (data: Prisma.categoryUncheckedCreateInput) => {
  return new Promise<category>(async (resolve, reject) => {
    try {
      const category = await prisma.category.create({
        data: data,
      });
      return resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.categoryUpdateInput, id: number) => {
  return new Promise<category>(async (resolve, reject) => {
    try {
      const category = await prisma.category.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<category>(async (resolve, reject) => {
    try {
      const category = await prisma.category.findUnique({
        where: {
          id: id,
        },
      });
      if (category === null) {
        throw new NotFoundError("category not found");
      }
      return resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = () => {
  return new Promise<category[]>(async (resolve, reject) => {
    try {
      const categories = await prisma.category.findMany({});
      return resolve(categories);
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
