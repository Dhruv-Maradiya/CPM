/* eslint-disable no-async-promise-executor */
import prisma from "../../../utils/prisma";
import { Prisma, branches } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index";

const create = (data: Prisma.branchesCreateInput) => {
  return new Promise<branches>(async (resolve, reject) => {
    try {
      const branch = await prisma.branches.create({
        data: data,
      });
      return resolve(branch);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.branchesUpdateInput, id: number) => {
  return new Promise<branches>(async (resolve, reject) => {
    try {
      const branches = await prisma.branches.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(branches);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<branches>(async (resolve, reject) => {
    try {
      const branch = await prisma.branches.findUnique({
        where: {
          id: id,
        },
      });
      if (!branch) {
        throw new NotFoundError("branch not found");
      }
      return resolve(branch);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = () => {
  return new Promise<branches[]>(async (resolve, reject) => {
    try {
      const branches = await prisma.branches.findMany({});
      return resolve(branches);
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
