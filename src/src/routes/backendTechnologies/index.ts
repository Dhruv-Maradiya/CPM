/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils";
import BackendTechnologies from "../../controllers/backendTechnologies/index";
import validation from "./validation/index";

const router = Router();

router.post("/", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    await validateSchema<Body>(validation.create, req.body, false);
    const body: Prisma.backendTechnologiesCreateInput = req.body;
    const backendTechnology = await BackendTechnologies.create(body);

    next(backendTechnology);
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

    const body: Prisma.backendTechnologiesUpdateInput = req.body;
    const backendTechnology = await BackendTechnologies.update(body, id);

    next(backendTechnology);
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
    const backendTechnology = await BackendTechnologies.find(id);

    next(backendTechnology);
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, _res, next) => {
  try {
    const backendTechnologies = await BackendTechnologies.findMany();

    next(backendTechnologies);
  } catch (error) {
    next(error);
  }
});

export default router;
