/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, category } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

type FindManyArgs = {
  select?: Prisma.categorySelect;
  where?: Prisma.categoryWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.categoryOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};

type FindOneArgs = {
  select: Prisma.categorySelect;
  where: Prisma.categoryWhereUniqueInput;
};

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
const find = ({ select, where }: FindOneArgs) => {
  return new Promise<Partial<category>>(async (resolve, reject) => {
    try {
      const category = await prisma.category.findUnique({
        where: where,
        select: select,
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
const findMany = ({ select, where, orderBy, take, skip }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [categories, count] = await Promise.all([
        prisma.category.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.category.count(),
      ]);
      return resolve({ categories, count });
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
