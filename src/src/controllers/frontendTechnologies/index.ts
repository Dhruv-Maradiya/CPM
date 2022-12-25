/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, frontendTechnologies } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

const create = (data: Prisma.frontendTechnologiesUncheckedCreateInput) => {
  return new Promise<frontendTechnologies>(async (resolve, reject) => {
    try {
      const frontendTechnology = await prisma.frontendTechnologies.create({
        data: data,
      });
      return resolve(frontendTechnology);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.frontendTechnologiesUpdateInput, id: number) => {
  return new Promise<frontendTechnologies>(async (resolve, reject) => {
    try {
      const frontendTechnology = await prisma.frontendTechnologies.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(frontendTechnology);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<frontendTechnologies>(async (resolve, reject) => {
    try {
      const frontendTechnology = await prisma.frontendTechnologies.findUnique({
        where: {
          id: id,
        },
      });
      if (!frontendTechnology) {
        throw new NotFoundError("frontendTechnology not found");
      }
      return resolve(frontendTechnology);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = () => {
  return new Promise<frontendTechnologies[]>(async (resolve, reject) => {
    try {
      const frontendTechnologies = await prisma.frontendTechnologies.findMany(
        {}
      );
      return resolve(frontendTechnologies);
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
