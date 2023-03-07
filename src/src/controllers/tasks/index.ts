/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, tasks } from "@prisma/client";

type FindManyArgs = {
  select?: Prisma.tasksSelect;
  where?: Prisma.tasksWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.tasksOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};

const create = (data: Prisma.tasksUncheckedCreateInput) => {
  return new Promise<tasks>(async (resolve, reject) => {
    try {
      const task = await prisma.tasks.create({
        data: data,
      });
      return resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.tasksUpdateInput, id: number) => {
  return new Promise<tasks>(async (resolve, reject) => {
    try {
      const task = await prisma.tasks.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = ({ take, skip, where, select, orderBy }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [tasks, count] = await Promise.all([
        prisma.tasks.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.tasks.count({
          ...(where ? { where: where } : {}),
        }),
      ]);
      return resolve({ tasks, count });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  create,
  update,
  findMany,
};
