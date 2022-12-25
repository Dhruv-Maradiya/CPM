/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, projects, students, tasks } from "@prisma/client";

type findManyByProjectReturnType = tasks & {
  assignedToParticipant: students;
};
type findManyByProjectFacultyReturnType = tasks & {
  assignedToParticipant: students;
  project: projects;
};

const create = (data: Prisma.tasksUncheckedCreateInput) => {
  return new Promise<tasks>(async (resolve, reject) => {
    try {
      const task = await prisma.tasks.create({
        data: data,
      });
      return resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.tasksUpdateInput, id: number) => {
  return new Promise<tasks>(async (resolve, reject) => {
    try {
      const task = await prisma.tasks.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = (studentId: number) => {
  return new Promise<tasks[]>(async (resolve, reject) => {
    try {
      const tasks = await prisma.tasks.findMany({
        where: {
          assignedToParticipantId: studentId,
        },
      });
      return resolve(tasks);
    } catch (error) {
      reject(error);
    }
  });
};
const findManyByProject = (projectId: number) => {
  return new Promise<findManyByProjectReturnType[]>(async (resolve, reject) => {
    try {
      const tasks = await prisma.tasks.findMany({
        where: {
          projectId: projectId,
        },
        include: {
          assignedToParticipant: true,
        },
      });
      return resolve(tasks);
    } catch (error) {
      reject(error);
    }
  });
};
const findManyByProjectFaculty = (facultyId: number) => {
  return new Promise<findManyByProjectFacultyReturnType[]>(
    async (resolve, reject) => {
      try {
        const tasks = await prisma.tasks.findMany({
          where: {
            project: {
              projectGuideMapping: {
                some: {
                  guideId: facultyId,
                },
              },
            },
          },
          include: {
            assignedToParticipant: true,
            project: true,
          },
        });
        return resolve(tasks);
      } catch (error) {
        reject(error);
      }
    }
  );
};

export default {
  create,
  update,
  findMany,
  findManyByProject,
  findManyByProjectFaculty,
};
