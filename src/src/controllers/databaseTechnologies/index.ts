/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, databaseTechnologies } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

const create = (data: Prisma.databaseTechnologiesUncheckedCreateInput) => {
  return new Promise<databaseTechnologies>(async (resolve, reject) => {
    try {
      const databaseTechnology = await prisma.databaseTechnologies.create({
        data: data,
      });
      return resolve(databaseTechnology);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.databaseTechnologiesUpdateInput, id: number) => {
  return new Promise<databaseTechnologies>(async (resolve, reject) => {
    try {
      const databaseTechnology = await prisma.databaseTechnologies.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(databaseTechnology);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<databaseTechnologies>(async (resolve, reject) => {
    try {
      const databaseTechnology = await prisma.databaseTechnologies.findUnique({
        where: {
          id: id,
        },
      });
      if (!databaseTechnology) {
        throw new NotFoundError("databaseTechnology not found");
      }
      return resolve(databaseTechnology);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = () => {
  return new Promise<databaseTechnologies[]>(async (resolve, reject) => {
    try {
      const databaseTechnologies = await prisma.databaseTechnologies.findMany(
        {}
      );
      return resolve(databaseTechnologies);
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
