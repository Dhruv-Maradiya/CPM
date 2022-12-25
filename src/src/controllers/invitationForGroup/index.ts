/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, invitationForGroup } from "@prisma/client";

const create = (data: Prisma.invitationForGroupUncheckedCreateInput) => {
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
const findManyByStudent = (studentId: number) => {
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
const findManyByLeader = (leaderId: number) => {
  return new Promise<invitationForGroup[]>(async (resolve, reject) => {
    try {
      const invitationForGroup = await prisma.invitationForGroup.findMany({
        where: {
          groupLeaderId: leaderId,
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
  findManyByStudent,
  findManyByLeader,
};
