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
  async (_req, res, next) => {
    try {
      let isUnreadNotifications = false;

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
      const projects = await Projects.findMany();

      res.locals["data"] = {
        projects,
        isUnreadNotifications,
      };
      next();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
