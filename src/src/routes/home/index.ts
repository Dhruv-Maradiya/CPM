/* eslint-disable no-async-promise-executor */
import { Router } from "express";
import { prisma } from "../../../utils/index.js";
import { auth } from "../../../middleware/index.js";
import Projects from "../../controllers/projects/index.js";
import Categories from "../../controllers/categories/index.js";
import { Prisma } from "@prisma/client";

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

      const categoryId =
        req.query["categoryId"] != null
          ? Number(req.query["categoryId"])
          : null;

      const search = req.query["search"] != null ? req.query["search"] : null;

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

      const whereArgs: Prisma.projectsWhereInput = {};

      if (categoryId != null) {
        whereArgs.categoryId = categoryId;
      }

      if (search != null) {
        whereArgs.name = {
          contains: search.toString(),
        };
      }

      const [projects, categories] = await Promise.all([
        Projects.findMany({
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
          where: whereArgs,
        }),
        Categories.findMany({
          select: {
            id: true,
            name: true,
          },
        }),
      ]);

      res.locals["data"] = {
        ...projects,
        categories,
        isUnreadNotifications,
      };
      next();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
