/* eslint-disable no-async-promise-executor */
import { prisma } from "../../../utils/index.js";
import { groupParticipants_role, Prisma, projects } from "@prisma/client";
import { NotFoundError } from "../../../exceptions/index.js";

type ProjectByStudentResponse = {
  id: number;
  name: string;
  academic: {
    id: number;
    year: number;
    sem: number;
  };
  isVerified: boolean;
  group: {
    id: number;
    name: string;
    groupParticipants: {
      id: number;
      semester: number;
      role: groupParticipants_role;
    }[];
  };
};
type FindManyResponse = {
  projects: projects[];
  count: number;
};
type FindManyArgs = {
  select?: Prisma.projectsSelect;
  where?: Prisma.projectsWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.projectsOrderByWithRelationInput>;
  take?: number;
  skip?: number;
};
type FindOneArgs = {
  select: Prisma.projectsSelect;
  where: Prisma.projectsWhereUniqueInput;
};

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

const upload = (id: number, files: Express.Multer.File[]) => {
  return new Promise<projects>(async (resolve, reject) => {
    try {
      const project = await prisma.projects.update({
        where: {
          id: id,
        },
        data: {
          media: {
            createMany: {
              skipDuplicates: true,
              data: files.map((file) => ({
                name: file.originalname,
                format: file.mimetype,
                identifier: file.filename,
              })),
            },
          },
        },
      });
      return resolve(project);
    } catch (error) {
      reject(error);
    }
  });
};

const find = ({ select, where }: FindOneArgs) => {
  return new Promise(async (resolve, reject) => {
    try {
      const project = await prisma.projects.findUnique({
        where: where,
        // select: {
        //   id: true,
        //   name: true,
        //   categoryId: true,
        //   academicId: true,
        //   frontendTechnologyId: true,
        //   backendTechnologyId: true,
        //   databaseTechnologyId: true,
        //   groupId: true,
        //   description: true,
        //   updatedAt: true,
        //   createdAt: true,
        //   isVerified: true,
        //   verifiedByFacultyId: true,
        //   academic: true,
        //   frontendTechnology: true,
        //   backendTechnology: true,
        //   databaseTechnology: true,
        //   media: true,
        //   category: true,
        // },
        select: select,
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
const findMany = ({ take, skip, where, select, orderBy }: FindManyArgs) => {
  return new Promise<FindManyResponse>(async (resolve, reject) => {
    try {
      const [projects, count] = await Promise.all([
        prisma.projects.findMany({
          ...(where ? { where: where } : {}),
          ...(select ? { select: select } : {}),
          ...(orderBy ? { orderBy: orderBy } : {}),
          ...(take != null ? { take: take } : {}),
          ...(skip != null ? { skip: skip } : {}),
        }),
        prisma.projects.count({
          ...(where ? { where: where } : {}),
        }),
      ]);

      return resolve({ projects, count });
    } catch (error) {
      reject(error);
    }
  });
};
const projectsByStudent = (studentId: number) => {
  return new Promise<ProjectByStudentResponse[]>(async (resolve, reject) => {
    try {
      const projects: ProjectByStudentResponse[] =
        await prisma.projects.findMany({
          where: {
            group: {
              groupParticipants: {
                some: {
                  studentId: studentId,
                },
              },
            },
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
            group: {
              select: {
                id: true,
                name: true,
                groupParticipants: {
                  select: {
                    id: true,
                    semester: true,
                    role: true,
                  },
                  where: {
                    studentId: studentId,
                  },
                },
              },
            },
            isVerified: true,
          },
        });
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
  projectsByStudent,
  upload,
};
