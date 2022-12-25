/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, groups, PrismaClient } from "@prisma/client";
import { MethodNotAllowed, NotFoundError } from "../../../exceptions/index.js";

const create = (
  data: Prisma.groupsUncheckedCreateInput,
  transaction: Prisma.TransactionClient | undefined
) => {
  return new Promise<groups>(async (resolve, reject) => {
    try {
      let db: PrismaClient | Prisma.TransactionClient = prisma;
      if (transaction) {
        db = transaction;
      }
      const group = await db.groups.create({
        data: data,
      });
      return resolve(group);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (
  data: Prisma.groupsUpdateInput,
  id: number,
  transaction: Prisma.TransactionClient | undefined
) => {
  return new Promise<groups>(async (resolve, reject) => {
    try {
      let db: PrismaClient | Prisma.TransactionClient = prisma;
      if (transaction) {
        db = transaction;
      }
      const group = await db.groups.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(group);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<groups>(async (resolve, reject) => {
    try {
      const group = await prisma.groups.findUnique({
        where: {
          id: id,
        },
      });
      if (!group) {
        throw new NotFoundError("group not found");
      }
      return resolve(group);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = () => {
  return new Promise<groups[]>(async (resolve, reject) => {
    try {
      const groups = await prisma.groups.findMany({});
      return resolve(groups);
    } catch (error) {
      reject(error);
    }
  });
};
const assignLeader = (
  groupId: number,
  studentId: number,
  transaction: Prisma.TransactionClient | undefined
) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      let db: PrismaClient | Prisma.TransactionClient = prisma;
      if (transaction) {
        db = transaction;
      }
      const groupDetails = await db.groups.findUnique({
        where: {
          id: groupId,
        },
        select: {
          groupParticipants: {
            select: {
              id: true,
              studentId: true,
              role: true,
            },
          },
          academic: {
            select: {
              maximumGroupMember: true,
            },
          },
        },
      });

      if (!groupDetails) {
        throw new NotFoundError("group not found");
      }

      if (
        groupDetails.academic.maximumGroupMember ===
        groupDetails.groupParticipants.length
      ) {
        throw new MethodNotAllowed(
          "there's already maximum number of participants in group"
        );
      }

      let isLeaderExists = false;
      for (let i = 0; i < groupDetails.groupParticipants.length; i++) {
        if (groupDetails.groupParticipants[i]?.role === "LEADER") {
          isLeaderExists = true;
        }
      }

      if (isLeaderExists) {
        throw new NotFoundError("group is already assigned a leader");
      }

      const studentDetails = await db.students.findUnique({
        where: {
          id: studentId,
        },
        select: {
          semester: true,
        },
      });

      if (!studentDetails) {
        throw new NotFoundError("student not found");
      }

      await db.groupParticipants.create({
        data: {
          groupId: groupId,
          studentId: studentId,
          role: "LEADER",
          semester: studentDetails.semester,
        },
      });

      resolve();
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
  assignLeader,
};
