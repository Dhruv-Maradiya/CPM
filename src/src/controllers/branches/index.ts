/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, branches } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

type FindManyArgs = {
  select?: Prisma.branchesSelect;
  where?: Prisma.branchesWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.branchesOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindOneArgs = {
  select: Prisma.branchesSelect;
  where: Prisma.branchesWhereUniqueInput;
};

const create = (data: Prisma.branchesUncheckedCreateInput) => {
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
const find = ({ select, where }: FindOneArgs) => {
  return new Promise<Partial<branches>>(async (resolve, reject) => {
    try {
      const branch = await prisma.branches.findUnique({
        where: where,
        select: select,
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
const findMany = ({ select, where, skip, take, orderBy }: FindManyArgs) => {
  return new Promise<branches[]>(async (resolve, reject) => {
    try {
      const branches = await prisma.branches.findMany({
        ...(where ? { where: where } : {}),
        ...(select ? { select: select } : {}),
        ...(skip != null ? { skip: skip } : {}),
        ...(take != null ? { take: take } : {}),
        ...(orderBy ? { orderBy: orderBy } : {}),
      });
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
