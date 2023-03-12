/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import InvitationForGroup from "../../controllers/invitationForGroup/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";

const router = Router();

router.post("/", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    const validatedBody = await validateSchema<Body>(
      validation.create,
      req.body,
      false
    );

    const invitations = await Promise.all(
      validatedBody.members.map(async (member) => {
        return InvitationForGroup.create({
          groupId: validatedBody.groupId,
          groupLeaderId: validatedBody.groupLeaderId,
          memberId: member,
          status: "PENDING",
        });
      })
    );

    // const body: Prisma.invitationForGroupUncheckedCreateInput = {
    //   ...validatedBody,
    //   status: "PENDING",
    // };

    // const invitationForGroup = await InvitationForGroup.create(body);

    res.locals["data"] = invitations;
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/updateStatus", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    await validateSchema<Body>(validation.update, req.body, false);

    const id = req.body.id;
    delete req.body.id;

    const body: Prisma.invitationForGroupUncheckedUpdateInput = req.body;

    const invitationForGroup = await InvitationForGroup.updateStatus(body, id);

    res.locals["data"] = invitationForGroup;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByStudentReceived", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.findManyByStudent>;
    const query = await validateSchema<Body>(
      validation.findManyByStudent,
      req.query,
      true
    );

    const invitationForGroups = await InvitationForGroup.findMany({
      where: {
        memberId: query.studentId,
      },
      select: {
        id: true,
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        groupLeader: {
          select: {
            id: true,
            name: true,
            enrollmentNo: true,
          },
        },
        member: {
          select: {
            id: true,
            name: true,
            enrollmentNo: true,
          },
        },
        status: true,
      },
    });

    res.locals["data"] = invitationForGroups;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByLeader", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.findManyByLeader>;
    const query = await validateSchema<Body>(
      validation.findManyByLeader,
      req.query,
      true
    );

    const invitationForGroups = await InvitationForGroup.findMany({
      where: {
        groupLeaderId: query.leaderId,
      },
      select: {
        id: true,
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        groupLeader: {
          select: {
            id: true,
            name: true,
            enrollmentNo: true,
          },
        },
        member: {
          select: {
            id: true,
            name: true,
            enrollmentNo: true,
          },
        },
        status: true,
      },
    });

    res.locals["data"] = invitationForGroups;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
