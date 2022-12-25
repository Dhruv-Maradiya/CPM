/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils";
import Faculty from "../../controllers/faculty/index";
import validation from "./validation/index";

const router = Router();

router.post("/", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    await validateSchema<Body>(validation.create, req.body, false);
    const body: Prisma.facultyCreateInput = req.body;
    const faculty = await Faculty.create(body);

    next(faculty);
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    await validateSchema<Body>(validation.update, req.body, true);

    const id = req.body.id;
    delete req.body.id;

    const body: Prisma.facultyUpdateInput = req.body;
    const faculty = await Faculty.update(body, id);

    next(faculty);
  } catch (error) {
    next(error);
  }
});
router.get("/find", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.find>;
    const validatedQuery = await validateSchema<Body>(
      validation.find,
      req.query,
      true
    );
    const id = validatedQuery["id"]; // validation goes here
    const faculty = await Faculty.find(id);

    next(faculty);
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, _res, next) => {
  try {
    const faculties = await Faculty.findMany();

    next(faculties);
  } catch (error) {
    next(error);
  }
});

export default router;
