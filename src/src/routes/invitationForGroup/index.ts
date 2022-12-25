/* eslint-disable no-async-promise-executor */
import prisma from "../../../utils/prisma";
import { Prisma, invitationForGroup } from "@prisma/client";

const create = (data: Prisma.invitationForGroupCreateInput) => {
  return new Promise<invitationForGroup>(async (resolve, reject) => {
    try {
      const invitationForGroup = await prisma.invitationForGroup.create({
        data: data,
      });
      return resolve(invitationForGroup);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.invitationForGroupCreateInput, id: number) => {
  return new Promise<invitationForGroup>(async (resolve, reject) => {
    try {
      const invitationForGroup = await prisma.invitationForGroup.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(invitationForGroup);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = (studentId: number) => {
  return new Promise<invitationForGroup[]>(async (resolve, reject) => {
    try {
      const invitationForGroup = await prisma.invitationForGroup.findMany({
        where: {
          memberId: studentId,
        },
      });
      return resolve(invitationForGroup);
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
