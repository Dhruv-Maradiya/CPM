/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, groups, PrismaClient } from "@prisma/client";
import { MethodNotAllowed, NotFoundError } from "../../../exceptions/index.js";

type FindManyArgs = {
  select?: Prisma.groupsSelect;
  where?: Prisma.groupsWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.groupsOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindOneArgs = {
  select: Prisma.groupsSelect;
  where: Prisma.groupsWhereUniqueInput;
};

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
      const group = (await db.groups.update({
        data: data,
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          academic: {
            select: {
              id: true,
              year: true,
              sem: true,
            },
          },
          groupParticipants: {
            select: {
              id: true,
              role: true,
              semester: true,
              student: {
                select: {
                  id: true,
                  enrollmentNo: true,
                  name: true,
                },
              },
            },
          },
        },
      })) as unknown as groups;
      return resolve(group);
    } catch (error) {
      reject(error);
    }
  });
};
const find = ({ select, where }: FindOneArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await prisma.groups.findUnique({
        where: where,
        select: select,
      });
      return resolve(group);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = ({ take, skip, select, where, orderBy }: FindManyArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [groups, count] = await Promise.all([
        prisma.groups.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.groups.count({ ...(where ? { where: where } : {}) }),
      ]);
      return resolve({ groups, count });
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

      for (let i = 0; i < groupDetails.groupParticipants.length; i++) {
        if (groupDetails.groupParticipants[i]?.role === "LEADER") {
          throw new NotFoundError("group is already assigned a leader");
        }
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
