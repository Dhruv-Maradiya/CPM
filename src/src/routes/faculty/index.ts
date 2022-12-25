/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Faculty from "../../controllers/faculty/index.js";
import validation from "./validation/index.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    const validatedBody = await validateSchema<Body>(
      validation.create,
      req.body,
      false
    );
    const body: Prisma.facultyUncheckedCreateInput = validatedBody;
    const faculty = await Faculty.create(body);

    res.locals["data"] = faculty;
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    await validateSchema<Body>(validation.update, req.body, true);

    const id = req.body.id;
    delete req.body.id;

    const body: Prisma.facultyUpdateInput = req.body;
    const faculty = await Faculty.update(body, id);

    res.locals["data"] = faculty;
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
    const faculty = await Faculty.find(id);

    res.locals["data"] = faculty;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    const faculties = await Faculty.findMany();

    res.locals["data"] = faculties;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
