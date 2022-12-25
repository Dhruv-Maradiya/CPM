/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Notifications from "../../controllers/notifications/index.js";
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

    const body: Prisma.notificationsUncheckedCreateInput = validatedSchema;

    const notification = await Notifications.create(body);

    res.locals["data"] = notification;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByFaculty", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.findManyByFaculty>;
    const query = await validateSchema<Body>(
      validation.findManyByFaculty,
      req.query,
      true
    );

    const notifications = await Notifications.findManyByFaculty(
      query.facultyId
    );

    res.locals["data"] = notifications;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
