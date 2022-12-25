/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, mediaComments } from "@prisma/client";

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
const findMany = (mediaId: number) => {
  return new Promise<mediaComments[]>(async (resolve, reject) => {
    try {
      const mediaComments = await prisma.mediaComments.findMany({
        where: {
          mediaId: mediaId,
        },
      });
      return resolve(mediaComments);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  create,
  findMany,
};
