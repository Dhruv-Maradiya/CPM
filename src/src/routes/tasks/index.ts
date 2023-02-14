/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Tasks from "../../controllers/tasks/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";

const router = Router();

router.post("/", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    req.body = await validateSchema<Body>(validation.create, req.body, true);
    const body: Prisma.tasksUncheckedCreateInput = {
      ...req.body,
      status: "PENDING",
    };
    const task = await Tasks.create(body);

    res.locals["data"] = task;
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/", auth, async (req, res, next) => {
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
router.get("/findMany", auth, async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const skip = req.query["skip"] ? Number(req.query["skip"]) : 0;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const take = req.query["take"] ? Number(req.query["take"]) : 0;

    type Body = yup.InferType<typeof validation.findMany>;
    const validatedQuery = await validateSchema<Body>(
      validation.findMany,
      req.query,
      true
    );
    const id = validatedQuery["studentId"]; // validation goes here
    const task = await Tasks.findMany(id, {
      skip,
      take,
    });

    res.locals["data"] = task;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByProject", auth, async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const skip = req.query["skip"] ? Number(req.query["skip"]) : 0;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const take = req.query["take"] ? Number(req.query["take"]) : 0;

    type Body = yup.InferType<typeof validation.findManyByProject>;
    const validatedQuery = await validateSchema<Body>(
      validation.findManyByProject,
      req.query,
      true
    );
    const id = validatedQuery["projectId"]; // validation goes here
    const task = await Tasks.findManyByProject(id, { skip, take });

    res.locals["data"] = task;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByProjectFaculty", auth, async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const skip = req.query["skip"] ? Number(req.query["skip"]) : 0;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const take = req.query["take"] ? Number(req.query["take"]) : 0;

    type Body = yup.InferType<typeof validation.findManyByProjectFaculty>;
    const validatedQuery = await validateSchema<Body>(
      validation.findManyByProjectFaculty,
      req.query,
      true
    );
    const id = validatedQuery["facultyId"]; // validation goes here
    const task = await Tasks.findMany(id, { skip, take });

    res.locals["data"] = task;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
