/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import FrontendTechnologies from "../../controllers/frontendTechnologies/index.js";
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
    const body: Prisma.frontendTechnologiesUncheckedCreateInput = validatedBody;
    const frontendTechnology = await FrontendTechnologies.create(body);

    res.locals["data"] = frontendTechnology;
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

    const body: Prisma.frontendTechnologiesUpdateInput = req.body;
    const frontendTechnology = await FrontendTechnologies.update(body, id);

    res.locals["data"] = frontendTechnology;
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
    const frontendTechnology = await FrontendTechnologies.find(id);

    res.locals["data"] = frontendTechnology;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    const frontendTechnologies = await FrontendTechnologies.findMany();

    res.locals["data"] = frontendTechnologies;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
