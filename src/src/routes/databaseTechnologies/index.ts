/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import DatabaseTechnologies from "../../controllers/databaseTechnologies/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";
import path from "path";
import url from "url";
import multer from "multer";
import { NotFoundError } from "../../../exceptions/index.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, "../../../../", "public/images"));
  },
  filename: function (_req, file, cb) {
    const name = file.originalname.split(".");

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + name[name.length - 1]);
  },
});
const upload = multer({ storage: storage });

const router = Router();

router.post("/", auth, upload.single("file"), async (req, res, next) => {
  try {
    const file = req.file as Express.Multer.File;

    if (file == null) {
      throw new NotFoundError("No files uploaded");
    }
    type Body = yup.InferType<typeof validation.create>;
    const validatedBody = await validateSchema<Body>(
      validation.create,
      req.body,
      false
    );
    const body: Prisma.databaseTechnologiesUncheckedCreateInput = {
      ...validatedBody,
      logo: file.filename,
    };
    const databaseTechnology = await DatabaseTechnologies.create(body);

    res.locals["data"] = databaseTechnology;
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/", auth, upload.single("file"), async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    await validateSchema<Body>(validation.update, req.body, true);

    const id = req.body.id;
    delete req.body.id;

    if (req.file != null) {
      req.body.logo = req.file.filename;
    }

    const body: Prisma.databaseTechnologiesUpdateInput = req.body;
    const databaseTechnology = await DatabaseTechnologies.update(body, +id);

    res.locals["data"] = databaseTechnology;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/find", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.find>;
    const validatedQuery = await validateSchema<Body>(
      validation.find,
      req.query,
      true
    );
    const id = validatedQuery["id"]; // validation goes here
    const databaseTechnology = await DatabaseTechnologies.find({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    });

    res.locals["data"] = databaseTechnology;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    const databaseTechnologies = await DatabaseTechnologies.findMany({
      select: {
        id: true,
        name: true,
        url: true,
      },
    });

    res.locals["data"] = databaseTechnologies;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
