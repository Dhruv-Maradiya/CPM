/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, notifications } from "@prisma/client";

const create = (data: Prisma.notificationsUncheckedCreateInput) => {
  return new Promise<notifications>(async (resolve, reject) => {
    try {
      const notification = await prisma.notifications.create({
        data: data,
      });
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

export default {
  create,
  findManyByFaculty,
};
