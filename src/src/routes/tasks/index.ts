/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Tasks from "../../controllers/tasks/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    req.body = await validateSchema<Body>(validation.create, req.body, true);
    const body: Prisma.tasksUncheckedCreateInput = req.body;
    const task = await Tasks.create(body);

    res.locals["data"] = task;
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    req.body = await validateSchema<Body>(validation.update, req.body, true);

    const id = req.body.id;
    delete req.body.id;

    const body: Prisma.tasksUpdateInput = req.body;
    const task = await Tasks.update(body, id);

    res.locals["data"] = task;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByMember", async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const skip = req.query["skip"] ? Number(req.query["skip"]) : 0;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const take = req.query["take"] ? Number(req.query["take"]) : 10;

    type Body = yup.InferType<typeof validation.findMany>;
    const validatedQuery = await validateSchema<Body>(
      validation.findMany,
      req.query,
      true
    );
    const studentId = validatedQuery["studentId"]; // validation goes here
    const projectId = validatedQuery["projectId"]; // validation goes here
    const task = await Tasks.findMany({
      where: {
        assignedToParticipant: {
          id: studentId,
        },
        projectId: projectId,
      },
      select: {
        id: true,
        description: true,
        name: true,
        priority: true,
        assignedToParticipant: {
          select: {
            id: true,
            name: true,
            enrollmentNo: true,
          },
        },
        createdByLeader: {
          select: {
            id: true,
            enrollmentNo: true,
            name: true,
          },
        },
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
        startTime: true,
        endTime: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: take,
    });

    res.locals["data"] = task;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByProject", async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const skip = req.query["skip"] ? Number(req.query["skip"]) : 0;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const take = req.query["take"] ? Number(req.query["take"]) : 10;

    type Body = yup.InferType<typeof validation.findManyByProject>;
    const validatedQuery = await validateSchema<Body>(
      validation.findManyByProject,
      req.query,
      true
    );
    const id = validatedQuery["projectId"]; // validation goes here
    // const task = await Tasks.findManyByProject(id, { skip, take });

    const task = await Tasks.findMany({
      where: {
        projectId: id,
      },
      select: {
        id: true,
        description: true,
        name: true,
        priority: true,
        assignedToParticipant: {
          select: {
            id: true,
            name: true,
            enrollmentNo: true,
          },
        },
        createdByLeader: {
          select: {
            id: true,
            enrollmentNo: true,
            name: true,
          },
        },
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
        startTime: true,
        endTime: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: take,
    });

    res.locals["data"] = task;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByProjectFaculty", async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const skip = req.query["skip"] ? Number(req.query["skip"]) : 0;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const take = req.query["take"] ? Number(req.query["take"]) : 10;

    type Body = yup.InferType<typeof validation.findManyByProjectFaculty>;
    const validatedQuery = await validateSchema<Body>(
      validation.findManyByProjectFaculty,
      req.query,
      true
    );
    const id = validatedQuery["facultyId"]; // validation goes here
    // const task = await Tasks.findMany(id, { skip, take });
    const task = await Tasks.findMany({
      where: {
        faculty: {
          id: id,
        },
      },
      select: {
        id: true,
        description: true,
        name: true,
        priority: true,
        assignedToParticipant: {
          select: {
            id: true,
            name: true,
            enrollmentNo: true,
          },
        },
        createdByLeader: {
          select: {
            id: true,
            enrollmentNo: true,
            name: true,
          },
        },
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
        startTime: true,
        endTime: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: take,
    });

    res.locals["data"] = task;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
