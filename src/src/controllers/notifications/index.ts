/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, notifications, notification_history } from "@prisma/client";

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
const findManyByFaculty = (facultyId: number) => {
  return new Promise<notifications[]>(async (resolve, reject) => {
    try {
      const notifications = await prisma.notifications.findMany({
        where: {
          sentBy: facultyId,
        },
      });
      return resolve(notifications);
    } catch (error) {
      reject(error);
    }
  });
};
const findManyByStudent = (studentId: number) => {
  return new Promise<notification_history[]>(async (resolve, reject) => {
    try {
      const notifications = await prisma.notification_history.findMany({
        where: {
          sentTo: studentId,
        },
        select: {
          sentBy: true,
          sentTo: true,
          message: true,
          isRead: true,
          id: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return resolve(notifications);
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
