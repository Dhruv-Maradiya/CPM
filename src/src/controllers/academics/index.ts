/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, academics } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

type FindManyArgs = {
  select?: Prisma.academicsSelect;
  where?: Prisma.academicsWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.academicsOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindOneArgs = {
  select: Prisma.academicsSelect;
  where: Prisma.academicsWhereUniqueInput;
};

const create = (data: Prisma.academicsUncheckedCreateInput) => {
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
const find = ({ select, where }: FindOneArgs) => {
  return new Promise<Partial<academics>>(async (resolve, reject) => {
    try {
      const academics = await prisma.academics.findUnique({
        where: where,
        select: select,
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
const findMany = ({ select, where, orderBy, skip, take }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [academics, count] = await Promise.all([
        prisma.academics.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.academics.count(),
      ]);
      return resolve({ academics, count });
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
