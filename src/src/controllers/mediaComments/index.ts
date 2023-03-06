/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, mediaComments } from "@prisma/client";

type FindManyArgs = {
  select?: Prisma.mediaCommentsSelect;
  where?: Prisma.mediaCommentsWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.mediaCommentsOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};

const create = (data: Prisma.mediaCommentsUncheckedCreateInput) => {
  return new Promise<mediaComments>(async (resolve, reject) => {
    try {
      const mediaComments = await prisma.mediaComments.create({
        data: data,
      });
      return resolve(mediaComments);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = ({ select, where, skip, take, orderBy }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [mediaComments, count] = await Promise.all([
        prisma.mediaComments.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.mediaComments.count({
          ...(where ? { where: where } : {}),
        }),
      ]);
      return resolve({ mediaComments, count });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  create,
  findMany,
};
