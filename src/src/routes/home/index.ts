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

      if (res.locals["user"] !== null && res.locals["user"] !== undefined) {
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
        select: {
          id: true,
          name: true,
          academic: {
            select: {
              id: true,
              sem: true,
              year: true,
              maximumGroupMember: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          frontendTechnology: {
            select: {
              id: true,
              name: true,
              logo: true,
              description: true,
              url: true,
            },
          },
          databaseTechnology: {
            select: {
              id: true,
              name: true,
              logo: true,
              description: true,
              url: true,
            },
          },
          backendTechnology: {
            select: {
              id: true,
              name: true,
              logo: true,
              description: true,
              url: true,
            },
          },
          isVerified: true,
          description: true,
          media: {
            select: {
              id: true,
              format: true,
              identifier: true,
              name: true,
            },
          },
          group: {
            select: {
              id: true,
              name: true,
              groupParticipants: {
                select: {
                  id: true,
                  role: true,
                  student: {
                    select: {
                      id: true,
                      name: true,
                      enrollmentNo: true,
                      profilePicture: true,
                      branch: {
                        select: {
                          name: true,
                          displayName: true,
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          projectGuideMapping: {
            select: {
              id: true,
              faculty: {
                select: {
                  name: true,
                  employeeId: true,
                  profilePicture: true,
                },
              },
            },
          },
        },
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
