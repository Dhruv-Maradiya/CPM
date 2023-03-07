/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, backendTechnologies } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

type FindManyArgs = {
  select?: Prisma.backendTechnologiesSelect;
  where?: Prisma.backendTechnologiesWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.backendTechnologiesOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindOneArgs = {
  select: Prisma.backendTechnologiesSelect;
  where: Prisma.backendTechnologiesWhereUniqueInput;
};

const create = (data: Prisma.backendTechnologiesUncheckedCreateInput) => {
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
const find = ({ select, where }: FindOneArgs) => {
  return new Promise<Partial<backendTechnologies>>(async (resolve, reject) => {
    try {
      const backendTechnology = await prisma.backendTechnologies.findUnique({
        where: where,

        select: select,
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
const findMany = ({ select, where, orderBy, take, skip }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [backendTechnologies, count] = await Promise.all([
        prisma.backendTechnologies.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.backendTechnologies.count({
          ...(where ? { where: where } : {}),
        }),
      ]);
      return resolve({ backendTechnologies, count });
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
