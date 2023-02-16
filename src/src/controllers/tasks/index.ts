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

type FindManyArgs = {
  take: number;
  skip: number;
};
type FindManyResp = {
  tasks: tasks[];
  count: number;
};
type FindManyByProjectResp = {
  tasks: findManyByProjectReturnType[];
  count: number;
};
type FindManyByProjectGuideResp = {
  tasks: findManyByProjectFacultyReturnType[];
  count: number;
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
const findMany = (studentId: number, { skip, take }: FindManyArgs) => {
  return new Promise<FindManyResp>(async (resolve, reject) => {
    try {
      const [tasks, count] = await Promise.all([
        prisma.tasks.findMany({
          where: {
            assignedToParticipantId: studentId,
          },
          skip,
          take,
        }),
        prisma.tasks.count({}),
      ]);
      return resolve({ tasks, count });
    } catch (error) {
      reject(error);
    }
  });
};
const findManyByProject = (projectId: number, { skip, take }: FindManyArgs) => {
  return new Promise<FindManyByProjectResp>(async (resolve, reject) => {
    try {
      const [tasks, count] = await Promise.all([
        prisma.tasks.findMany({
          where: {
            projectId: projectId,
          },
          include: {
            assignedToParticipant: true,
          },
          skip,
          take,
        }),
        prisma.tasks.count({}),
      ]);
      return resolve({ tasks, count });
    } catch (error) {
      reject(error);
    }
  });
};
const findManyByProjectGuide = (
  facultyId: number,
  { skip, take }: FindManyArgs
) => {
  return new Promise<FindManyByProjectGuideResp>(async (resolve, reject) => {
    try {
      const [tasks, count] = await Promise.all([
        prisma.tasks.findMany({
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
          skip,
          take,
        }),
        prisma.tasks.count({}),
      ]);
      return resolve({ tasks, count });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  create,
  update,
  findMany,
  findManyByProject,
  findManyByProjectGuide,
};
