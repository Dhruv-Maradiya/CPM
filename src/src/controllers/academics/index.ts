/* eslint-disable no-async-promise-executor */
import prisma from "../../../utils/prisma";
import { Prisma, academics } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index";

const create = (data: Prisma.academicsCreateInput) => {
  return new Promise<academics>(async (resolve, reject) => {
    try {
      const academics = await prisma.academics.create({
        data: data,
      });
      return resolve(academics);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.academicsUpdateInput, id: number) => {
  return new Promise<academics>(async (resolve, reject) => {
    try {
      const academics = await prisma.academics.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(academics);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<academics>(async (resolve, reject) => {
    try {
      const academics = await prisma.academics.findUnique({
        where: {
          id: id,
        },
      });
      if (!academics) {
        throw new NotFoundError("academics not found");
      }
      return resolve(academics);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = () => {
  return new Promise<academics[]>(async (resolve, reject) => {
    try {
      const academics = await prisma.academics.findMany({});
      return resolve(academics);
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
