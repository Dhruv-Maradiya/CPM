/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Academics from "../../controllers/academics/index.js";
import validation from "./validation/index.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    const validatedSchema = await validateSchema<Body>(
      validation.create,
      req.body,
      false
    );
    const body: Prisma.academicsUncheckedCreateInput = validatedSchema;
    const academics = await Academics.create(body);

    res.locals["data"] = academics;
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    await validateSchema<Body>(validation.update, req.body, false);

    const id = req.body.id as number;
    delete req.body.id;

    const body: Prisma.academicsUpdateInput = req.body; // validation goes here
    const academics = await Academics.update(body, id);

    res.locals["data"] = academics;
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
    const academics = await Academics.find({
      where: {
        id: id,
      },
      select: {
        id: true,
        maximumGroupMember: true,
        sem: true,
        year: true,
      },
    });

    res.locals["data"] = academics;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    const academics = await Academics.findMany({
      select: {
        id: true,
        maximumGroupMember: true,
        sem: true,
        year: true,
      },
    });

    res.locals["data"] = academics;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
