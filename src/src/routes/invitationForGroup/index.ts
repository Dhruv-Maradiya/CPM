/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import InvitationForGroup from "../../controllers/invitationForGroup/index.js";
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

    const body: Prisma.invitationForGroupUncheckedCreateInput = {
      ...validatedBody,
      status: "PENDING",
    };

    const invitationForGroup = await InvitationForGroup.create(body);

    res.locals["data"] = invitationForGroup;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByStudent", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.findManyByStudent>;
    const query = await validateSchema<Body>(
      validation.findManyByStudent,
      req.query,
      true
    );

    const invitationForGroups = await InvitationForGroup.findManyByStudent(
      query.studentId
    );

    res.locals["data"] = invitationForGroups;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyByLeader", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.findManyByLeader>;
    const query = await validateSchema<Body>(
      validation.findManyByLeader,
      req.query,
      true
    );

    const invitationForGroups = await InvitationForGroup.findManyByLeader(
      query.leaderId
    );

    res.locals["data"] = invitationForGroups;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
