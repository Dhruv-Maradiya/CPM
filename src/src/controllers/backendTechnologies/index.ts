/* eslint-disable no-async-promise-executor */
import prisma from "../../../utils/prisma";
import { Prisma, backendTechnologies } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index";

const create = (data: Prisma.backendTechnologiesCreateInput) => {
  return new Promise<backendTechnologies>(async (resolve, reject) => {
    try {
      const backendTechnology = await prisma.backendTechnologies.create({
        data: data,
      });
      return resolve(backendTechnology);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.backendTechnologiesUpdateInput, id: number) => {
  return new Promise<backendTechnologies>(async (resolve, reject) => {
    try {
      const backendTechnology = await prisma.backendTechnologies.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(backendTechnology);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<backendTechnologies>(async (resolve, reject) => {
    try {
      const backendTechnology = await prisma.backendTechnologies.findUnique({
        where: {
          id: id,
        },
      });
      if (!backendTechnology) {
        throw new NotFoundError("backendTechnology not found");
      }
      return resolve(backendTechnology);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = () => {
  return new Promise<backendTechnologies[]>(async (resolve, reject) => {
    try {
      const backendTechnologies = await prisma.backendTechnologies.findMany({});
      return resolve(backendTechnologies);
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
