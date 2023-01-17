/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Projects from "../../controllers/projects/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";

const router = Router();

router.post("/", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    const validatedBody = await validateSchema<Body>(
      validation.create,
      req.body,
      false
    );
    const body: Prisma.projectsUncheckedCreateInput = validatedBody;
    const project = await Projects.create(body);

    res.locals["data"] = project;
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

    const body: Prisma.projectsUpdateInput = req.body;
    const project = await Projects.update(body, id);

    res.locals["data"] = project;
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
    const project = await Projects.find(id);

    res.locals["data"] = project;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    const projects = await Projects.findMany();

    res.locals["data"] = projects;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
