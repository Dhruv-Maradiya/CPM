/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, notifications } from "@prisma/client";

type FindManyNotificationsArgs = {
  select?: Prisma.notificationsSelect;
  where?: Prisma.notificationsWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.notificationsOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindManyNotificationHistoryArgs = {
  select?: Prisma.notification_historySelect;
  where?: Prisma.notification_historyWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.notification_historyOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};

const create = (data: Prisma.notificationsUncheckedCreateInput) => {
  return new Promise<notifications>(async (resolve, reject) => {
    try {
      const toUsers = data.toUsers?.split(",") || [];

      const notification = await prisma.notifications.create({
        data: data,
      });

      if (toUsers.length > 0) {
        await prisma.notification_history.createMany({
          data: toUsers.map((user) => ({
            sentTo: +user,
            isRead: false,
            message: data.message,
            sentBy: data.sentBy,
          })),
        });
      }

      // emailing stuff will goes here...
      return resolve(notification);
    } catch (error) {
      reject(error);
    }
  });
};
const findManyByFaculty = ({
  select,
  where,
  skip,
  take,
  orderBy,
}: FindManyNotificationsArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [notifications, count] = await Promise.all([
        prisma.notifications.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.notifications.count({
          ...(where ? { where: where } : {}),
        }),
      ]);
      return resolve({ notifications, count });
    } catch (error) {
      reject(error);
    }
  });
};
const findManyByStudent = ({
  select,
  where,
  skip,
  take,
  orderBy,
}: FindManyNotificationHistoryArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const notifications = await prisma.notification_history.findMany({
      //   where: {
      //     sentTo: studentId,
      //     isRead: false,
      //   },
      //   select: {
      //     sentBy: true,
      //     sentTo: true,
      //     message: true,
      //     isRead: true,
      //     id: true,
      //     createdAt: true,
      //     updatedAt: true,
      //   },
      // });
      const [notifications, count] = await Promise.all([
        prisma.notification_history.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.notification_history.count({
          ...(where ? { where: where } : {}),
        }),
      ]);
      return resolve({ notifications, count });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  create,
  findManyByFaculty,
  findManyByStudent,
};
