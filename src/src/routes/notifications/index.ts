/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Notifications from "../../controllers/notifications/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    const validatedSchema = await validateSchema<Body>(
      validation.create,
      req.body,
      false
    );

    const body: Prisma.notificationsUncheckedCreateInput = {
      ...validatedSchema,
      sentBy: res.locals["user"].userDetails.id as number,
    };

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

    const notifications = await Notifications.findManyByFaculty({
      where: {
        sentBy: query.facultyId,
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
    });

    res.locals["data"] = notifications;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByStudent", async (_req, res, next) => {
  try {
    const id = res.locals["user"].userDetails.id as number;

    const notifications = await Notifications.findManyByStudent({
      where: {
        sentTo: id,
        isRead: false,
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.locals["data"] = notifications;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
