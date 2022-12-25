/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import MediaComments from "../../controllers/mediaComments/index.js";
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

    const body: Prisma.mediaCommentsUncheckedCreateInput = validatedSchema;

    const mediaComment = await MediaComments.create(body);

    res.locals["data"] = mediaComment;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.findMany>;
    const query = await validateSchema<Body>(
      validation.findMany,
      req.query,
      true
    );

    const mediaComments = await MediaComments.findMany(query.mediaId);

    res.locals["data"] = mediaComments;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
