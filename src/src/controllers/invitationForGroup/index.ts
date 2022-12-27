/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, invitationForGroup } from "@prisma/client";
import { NotFoundError, ValidationError } from "../../../exceptions/index.js";

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
const updateStatus = (
  data: Prisma.invitationForGroupUncheckedUpdateInput,
  id: number
) => {
  return new Promise<invitationForGroup>(async (resolve, reject) => {
    try {
      const status = data.status;

      if (status === undefined) {
        throw new NotFoundError(`status not found`);
      } else {
        const invitationDetails = await prisma.invitationForGroup.findUnique({
          where: {
            id,
          },
          select: {
            status: true,
            createdAt: true,
            groupId: true,
            member: {
              select: {
                id: true,
                semester: true,
              },
            },
          },
        });

        if (!invitationDetails) {
          throw new NotFoundError(`invitation not found`);
        }

        if (invitationDetails.status !== "PENDING") {
          throw new ValidationError(`invitation already proceeded`);
        }

        const now = new Date();
        now.setDate(now.getDate() - 5);
        if (invitationDetails.createdAt < now) {
          throw new ValidationError(`invitation already expired`);
        }

        if (status === "REJECTED") {
          const invitationForGroup = await prisma.invitationForGroup.update({
            where: {
              id: id,
            },
            data: {
              status: status,
            },
          });
          return resolve(invitationForGroup);
        } else if (status === "ACCEPTED") {
          const [invitationForGroup] = await prisma.$transaction([
            prisma.invitationForGroup.update({
              where: {
                id: id,
              },
              data: {
                status: status,
              },
            }),
            prisma.groupParticipants.createMany({
              data: [
                {
                  groupId: invitationDetails.groupId,
                  studentId: invitationDetails.member.id,
                  semester: invitationDetails.member.semester,
                  role: "MEMBER",
                },
              ],
              skipDuplicates: true,
            }),
          ]);
          return resolve(invitationForGroup);
        }
      }
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
  updateStatus,
  findManyByStudent,
  findManyByLeader,
};
