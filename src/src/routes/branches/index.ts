/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Branches from "../../controllers/branches/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    const validatedBody = await validateSchema<Body>(
      validation.create,
      req.body,
      false
    );
    const body: Prisma.branchesUncheckedCreateInput = validatedBody;
    const branch = await Branches.create(body);

    res.locals["data"] = branch;
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

    const body: Prisma.branchesUpdateInput = req.body;
    const branch = await Branches.update(body, id);

    res.locals["data"] = branch;
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
    const id = validatedQuery["id"];
    const branch = await Branches.find({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
      },
    });

    res.locals["data"] = branch;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    const branches = await Branches.findMany({
      select: {
        id: true,
        name: true,
        displayName: true,
      },
    });

    res.locals["data"] = branches;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
