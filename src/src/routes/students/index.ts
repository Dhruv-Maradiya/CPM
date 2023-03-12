/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Students from "../../controllers/students/index.js";
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
    const body: Prisma.studentsUncheckedCreateInput = validatedBody;
    const student = await Students.create(body);
    const token = await Students.signToken(student.enrollmentNo, student.id);

    res.locals["data"] = { token, student };
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/", auth, upload.single("file"), async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    req.body = await validateSchema<Body>(validation.update, req.body, true);

    const id = req.body.id;
    delete req.body.id;

    if (req.file != null) {
      req.body.profilePicture = req.file.filename;
    }

    const body: Prisma.studentsUpdateInput = req.body;
    const student = await Students.update(body, id);

    res.locals["data"] = student;
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
    const student = await Students.find({
      select: {
        id: true,
        enrollmentNo: true,
        profilePicture: true,
        name: true,
        email: true,
        branch: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        number: true,
        semester: true,
      },
      where: {
        id: id,
      },
    });

    res.locals["data"] = student;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findMany", async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const skip = req.query["skip"] ? Number(req.query["skip"]) : 0;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const take = req.query["take"] ? Number(req.query["take"]) : 10;
    const students = await Students.findMany({
      skip,
      take,
      select: {
        id: true,
        enrollmentNo: true,
        profilePicture: true,
        name: true,
        email: true,
        branch: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        number: true,
        semester: true,
      },
    });

    res.locals["data"] = students;
    next();
  } catch (error) {
    next(error);
  }
});
router.get("/findManyForInvite", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.findManyInvite>;
    const query = await validateSchema<Body>(
      validation.findManyInvite,
      req.query,
      true
    );

    const userDetails = res.locals["user"];

    const students = await Students.findMany({
      skip: query.skip,
      take: query.take,
      select: {
        id: true,
        enrollmentNo: true,
        profilePicture: true,
        name: true,
        email: true,
        branch: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        number: true,
        semester: true,
      },
      where: {
        id: {
          not: userDetails.userDetails.id,
        },
        ...(query["search"] != null
          ? {
              enrollmentNo: {
                startsWith: query["search"],
              },
            }
          : {}),
      },
    });

    res.locals["data"] = students;
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
    const { token, userId } = await Students.login(
      validatedBody.enrollmentNo,
      validatedBody.password
    );

    res.locals["data"] = {
      token: token,
      userId: userId,
    };
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
