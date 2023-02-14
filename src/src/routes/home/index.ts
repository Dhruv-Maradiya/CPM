/* eslint-disable no-async-promise-executor */
import { Router } from "express";
import { prisma } from "../../../utils/index.js";
import { auth } from "../../../middleware/index.js";
import Projects from "../../controllers/projects/index.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    auth(req, res, next, false);
  },
  async (req, res, next) => {
    try {
      let isUnreadNotifications = false;

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      const skip = req.query["skip"] ? Number(req.query["skip"]) : 0;
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      const take = req.query["take"] ? Number(req.query["take"]) : 10;

      if (res.locals["user"] !== null) {
        const userId = res.locals["user"].userDetails.id;
        const unreadNotifications = await prisma.notification_history.count({
          where: {
            isRead: false,
            sentTo: userId,
          },
          select: {
            _all: true,
          },
        });
        unreadNotifications._all > 0
          ? (isUnreadNotifications = true)
          : (isUnreadNotifications = false);
      }
      const projects = await Projects.findMany({
        take,
        skip,
      });

      res.locals["data"] = {
        ...projects,
        isUnreadNotifications,
      };
      next();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
