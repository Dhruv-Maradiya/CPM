/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils";
import Academics from "../../controllers/academics/index";
import validation from "./validation/index";

const router = Router();

router.post("/", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    await validateSchema<Body>(validation.create, req.body, false);
    const body: Prisma.academicsCreateInput = req.body;
    const academics = await Academics.create(body);

    next(academics);
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    await validateSchema<Body>(validation.update, req.body, false);

    const id = req.body.id as number;
    delete req.body.id;

    const body: Prisma.academicsUpdateInput = req.body; // validation goes here
    const academics = await Academics.update(body, id);

    next(academics);
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
    const academics = await Academics.find(id);

    next(academics);
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, _res, next) => {
  try {
    const academics = await Academics.findMany();

    next(academics);
  } catch (error) {
    next(error);
  }
});

export default router;
