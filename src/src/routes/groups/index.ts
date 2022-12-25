/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { prisma, validateSchema, yup } from "../../../utils";
import Groups from "../../controllers/groups/index";
import validation from "./validation/index";

const router = Router();

router.post("/", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    await validateSchema<Body>(validation.create, req.body, false);

    const leaderId: number = req.body.leaderId;

    delete req.body.leaderId;

    const body: Prisma.groupsCreateInput = req.body;

    const group = await prisma.$transaction(async (transaction) => {
      const group = await Groups.create(body, transaction);
      await Groups.assignLeader(group.id, leaderId, transaction);
      return group;
    });

    next(group);
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    await validateSchema<Body>(validation.update, req.body, true);

    const id = req.body.id;
    delete req.body.id;

    const body: Prisma.groupsUpdateInput = req.body;
    const group = await Groups.update(body, id, undefined);

    next(group);
  } catch (error) {
    next(error);
  }
});
router.get("/find", async (req, _res, next) => {
  try {
    type Body = yup.InferType<typeof validation.find>;
    const validatedQuery = await validateSchema<Body>(
      validation.find,
      req.query,
      true
    );
    const id = validatedQuery["id"]; // validation goes here
    const group = await Groups.find(id);

    next(group);
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, _res, next) => {
  try {
    const groups = await Groups.findMany();

    next(groups);
  } catch (error) {
    next(error);
  }
});

export default router;
