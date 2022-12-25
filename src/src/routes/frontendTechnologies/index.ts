/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils";
import FrontendTechnologies from "../../controllers/frontendTechnologies/index";
import validation from "./validation/index";

const router = Router();

router.post("/", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    await validateSchema<Body>(validation.create, req.body, false);
    const body: Prisma.frontendTechnologiesCreateInput = req.body;
    const frontendTechnology = await FrontendTechnologies.create(body);

    next(frontendTechnology);
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

    const body: Prisma.frontendTechnologiesUpdateInput = req.body;
    const frontendTechnology = await FrontendTechnologies.update(body, id);

    next(frontendTechnology);
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
    const frontendTechnology = await FrontendTechnologies.find(id);

    next(frontendTechnology);
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, _res, next) => {
  try {
    const frontendTechnologies = await FrontendTechnologies.findMany();

    next(frontendTechnologies);
  } catch (error) {
    next(error);
  }
});

export default router;
