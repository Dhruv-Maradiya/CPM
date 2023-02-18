/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, databaseTechnologies } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

type FindManyArgs = {
  select?: Prisma.databaseTechnologiesSelect;
  where?: Prisma.databaseTechnologiesWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.databaseTechnologiesOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindOneArgs = {
  select: Prisma.databaseTechnologiesSelect;
  where: Prisma.databaseTechnologiesWhereUniqueInput;
};

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
const find = ({ select, where }: FindOneArgs) => {
  return new Promise<Partial<databaseTechnologies>>(async (resolve, reject) => {
    try {
      const databaseTechnology = await prisma.databaseTechnologies.findUnique({
        where: where,
        select: select,
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
const findMany = ({ select, where, orderBy, skip, take }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [databaseTechnologies, count] = await Promise.all([
        prisma.databaseTechnologies.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.databaseTechnologies.count(),
      ]);
      return resolve({ databaseTechnologies, count });
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
