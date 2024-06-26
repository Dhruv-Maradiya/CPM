/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Category from "../../controllers/categories/index.js";
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
    const body: Prisma.categoryUncheckedCreateInput = validatedBody;
    const category = await Category.create(body);

    res.locals["data"] = category;
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

    const body: Prisma.categoryUpdateInput = req.body;
    const category = await Category.update(body, id);

    res.locals["data"] = category;
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
    const category = await Category.find({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.locals["data"] = category;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    const categories = await Category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.locals["data"] = categories;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
