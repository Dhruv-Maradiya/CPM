/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import BackendTechnologies from "../../controllers/backendTechnologies/index.js";
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
    const body: Prisma.backendTechnologiesUncheckedCreateInput = validatedBody;
    const backendTechnology = await BackendTechnologies.create(body);

    res.locals["data"] = backendTechnology;
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

    const body: Prisma.backendTechnologiesUpdateInput = req.body;
    const backendTechnology = await BackendTechnologies.update(body, id);

    res.locals["data"] = backendTechnology;
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
    const backendTechnology = await BackendTechnologies.find(id);

    res.locals["data"] = backendTechnology;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    const backendTechnologies = await BackendTechnologies.findMany();

    res.locals["data"] = backendTechnologies;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
