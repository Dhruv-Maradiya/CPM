/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { Prisma, projects } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

const create = (data: Prisma.projectsUncheckedCreateInput) => {
  return new Promise<projects>(async (resolve, reject) => {
    try {
      const project = await prisma.projects.create({
        data: data,
      });
      return resolve(project);
    } catch (error) {
      reject(error);
    }
  });
};
const update = (data: Prisma.projectsUpdateInput, id: number) => {
  return new Promise<projects>(async (resolve, reject) => {
    try {
      const project = await prisma.projects.update({
        data: data,
        where: {
          id: id,
        },
      });
      return resolve(project);
    } catch (error) {
      reject(error);
    }
  });
};
const find = (id: number) => {
  return new Promise<projects>(async (resolve, reject) => {
    try {
      const project = await prisma.projects.findUnique({
        where: {
          id: id,
        },
      });
      if (!project) {
        throw new NotFoundError("project not found");
      }
      return resolve(project);
    } catch (error) {
      reject(error);
    }
  });
};
const findMany = () => {
  return new Promise<projects[]>(async (resolve, reject) => {
    try {
      const projects = await prisma.projects.findMany({});
      return resolve(projects);
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
};
