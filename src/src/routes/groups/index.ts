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
      return group;
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
    });

    res.locals["data"] = groups;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
