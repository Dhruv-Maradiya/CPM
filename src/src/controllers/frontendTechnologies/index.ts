/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, frontendTechnologies } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

type FindManyArgs = {
  select?: Prisma.frontendTechnologiesSelect;
  where?: Prisma.frontendTechnologiesWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.frontendTechnologiesOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindOneArgs = {
  select: Prisma.frontendTechnologiesSelect;
  where: Prisma.frontendTechnologiesWhereUniqueInput;
};

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
const find = ({ select, where }: FindOneArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const frontendTechnology = await prisma.frontendTechnologies.findUnique({
        where: where,
        select: select,
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
const findMany = ({ take, skip, select, where, orderBy }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [frontendTechnologies, count] = await Promise.all([
        prisma.frontendTechnologies.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.frontendTechnologies.count({
          ...(where ? { where: where } : {}),
        }),
      ]);
      return resolve({ frontendTechnologies, count });
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
