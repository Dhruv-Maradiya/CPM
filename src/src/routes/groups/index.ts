/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { prisma, validateSchema, yup } from "../../../utils/index.js";
import Groups from "../../controllers/groups/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";

const router = Router();

router.post("/", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    await validateSchema<Body>(validation.create, req.body, false);

    const leaderId: number = req.body.leaderId;

    delete req.body.leaderId;

    const body: Prisma.groupsUncheckedCreateInput = req.body;

    const group = await prisma.$transaction(async (transaction) => {
      const group = await Groups.create(body, transaction);
      await Groups.assignLeader(group.id, leaderId, transaction);

      return await Groups.find({
        where: {
          id: group.id,
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
                  profilePicture: true,
                },
              },
            },
          },
        },
      });
    });

    res.locals["data"] = group;
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    await validateSchema<Body>(validation.update, req.body, true);

    const id = req.body.id;
    delete req.body.id;

    if (req.body.leaderId !== undefined) {
      await Groups.assignLeader(id, req.body.leaderId, undefined);
      delete req.body.leaderId;
    }

    const body: Prisma.groupsUpdateInput = req.body;

    const group = await Groups.update(body, id, undefined);

    res.locals["data"] = group;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/find", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.find>;
    const validatedQuery = await validateSchema<Body>(
      validation.find,
      req.query,
      true
    );
    const id = validatedQuery["id"]; // validation goes here
    const group = await Groups.find({
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
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    res.locals["data"] = group;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const take = _req.query["take"] ? Number(_req.query["take"]) : 10;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const skip = _req.query["skip"] ? Number(_req.query["skip"]) : 0;

    const search = _req.query["search"] ?? "";

    const groups = await Groups.findMany({
      take: take,
      skip: skip,
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
      where: {
        name: {
          contains: search as string,
        },
      },
    });

    res.locals["data"] = groups;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMy", auth, async (_req, res, next) => {
  try {
    const userDetails = res.locals["user"];
    const groups = await Groups.findMany({
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
        projects: {
          select: {
            id: true,
            name: true,
            academic: {
              select: {
                id: true,
                sem: true,
                year: true,
                maximumGroupMember: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            frontendTechnology: {
              select: {
                id: true,
                name: true,
                logo: true,
                description: true,
                url: true,
              },
            },
            databaseTechnology: {
              select: {
                id: true,
                name: true,
                logo: true,
                description: true,
                url: true,
              },
            },
            backendTechnology: {
              select: {
                id: true,
                name: true,
                logo: true,
                description: true,
                url: true,
              },
            },
            isVerified: true,
            description: true,
            media: {
              select: {
                id: true,
                format: true,
                identifier: true,
                name: true,
              },
            },
            group: {
              select: {
                id: true,
                name: true,
                groupParticipants: {
                  select: {
                    id: true,
                    role: true,
                    student: {
                      select: {
                        id: true,
                        name: true,
                        enrollmentNo: true,
                        profilePicture: true,
                        branch: {
                          select: {
                            name: true,
                            displayName: true,
                            id: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            projectGuideMapping: {
              select: {
                id: true,
                faculty: {
                  select: {
                    name: true,
                    employeeId: true,
                    profilePicture: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        groupParticipants: {
          some: {
            studentId: userDetails.userDetails.id,
          },
        },
      },
    });

    res.locals["data"] = groups;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
