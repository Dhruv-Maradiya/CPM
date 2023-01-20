/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Students from "../../controllers/students/index.js";
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
    const body: Prisma.studentsUncheckedCreateInput = validatedBody;
    const student = await Students.create(body);
    const token = await Students.signToken(student.enrollmentNo, student.id);

    res.locals["data"] = { token, student };
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

    const body: Prisma.studentsUpdateInput = req.body;
    const student = await Students.update(body, id);

    res.locals["data"] = student;
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
    const student = await Students.find(id);

    res.locals["data"] = student;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    const students = await Students.findMany();

    res.locals["data"] = students;
    next();
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.login>;
    const validatedBody = await validateSchema<Body>(
      validation.login,
      req.body,
      false
    );
    const token = await Students.login(
      validatedBody.enrollmentNo,
      validatedBody.password
    );

    res.locals["data"] = {
      token: token,
    };
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
