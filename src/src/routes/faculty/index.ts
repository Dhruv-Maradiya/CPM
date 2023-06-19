/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Faculty from "../../controllers/faculty/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";
import path from "path";
import url from "url";
import multer from "multer";

const router = Router();

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

router.post("/", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.create>;
    const validatedBody = await validateSchema<Body>(
      validation.create,
      req.body,
      false
    );

    const body: Prisma.facultyCreateInput = {
      email: validatedBody.email,
      employeeId: validatedBody.employeeId,
      number: validatedBody.number,
      name: validatedBody.name,
      password: validatedBody.password,
      facultyRoles: {
        connect: {
          name: validatedBody.role,
        },
      },
      createdBy: {
        connect: {
          id: validatedBody.createdById,
        },
      },
    };
    const faculty = await Faculty.create(body);

    res.locals["data"] = faculty;
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/", upload.single("file"), async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    req.body = await validateSchema<Body>(validation.update, req.body, true);

    const id = req.body.id;
    delete req.body.id;

    if (req.file != null) {
      req.body.profilePicture = req.file.filename;
    }

    const body: Prisma.facultyUpdateInput = req.body;
    const faculty = await Faculty.update(body, id);

    res.locals["data"] = faculty;
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
    const faculty = await Faculty.find({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        facultyRoles: {
          select: {
            id: true,
            name: true,
          },
        },
        email: true,
        employeeId: true,
        number: true,
        profilePicture: true,
      },
    });

    res.locals["data"] = faculty;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (_req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const take = _req.query["take"] ? Number(_req.query["take"]) : 10;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const skip = _req.query["skip"] ? Number(_req.query["skip"]) : 0;
    const faculties = await Faculty.findMany({
      take: take,
      skip: skip,
      select: {
        id: true,
        name: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        email: true,
        employeeId: true,
        number: true,
        profilePicture: true,
        isBlocked: true,
      },
    });

    res.locals["data"] = faculties;
    next();
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.login>;
    const validatedBody = await validateSchema<Body>(
      validation.login,
      req.body,
      false
    );
    const { token, userId, role, name, profilePicture } = await Faculty.login(
      validatedBody.employeeId,
      validatedBody.password
    );

    res.locals["data"] = {
      token: token,
      userId: userId,
      role: role,
      name: name,
      profilePicture: profilePicture,
    };
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
