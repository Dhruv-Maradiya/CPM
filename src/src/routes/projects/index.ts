/* eslint-disable no-async-promise-executor */
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { validateSchema, yup } from "../../../utils/index.js";
import Projects from "../../controllers/projects/index.js";
import validation from "./validation/index.js";
import { auth } from "../../../middleware/index.js";
import multer from "multer";
import path from "path";
import url from "url";
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

router.post("/", upload.array("files"), auth, async (req, res, next) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (files.length === 0) {
      throw new NotFoundError("No files uploaded");
    }

    type Body = yup.InferType<typeof validation.create>;
    const validatedBody = await validateSchema<Body>(
      validation.create,
      req.body,
      true
    );

    const body: Prisma.projectsUncheckedCreateInput = validatedBody;
    const project = await Projects.create(body);
    await Projects.upload(project.id, files);
    res.locals["data"] = project;
    next();
  } catch (error) {
    next(error);
  }
});
router.put("/", auth, async (req, res, next) => {
  try {
    type Body = yup.InferType<typeof validation.update>;
    await validateSchema<Body>(validation.update, req.body, true);

    const id = req.body.id;
    delete req.body.id;

    const body: Prisma.projectsUpdateInput = req.body;
    const project = await Projects.update(body, id);

    res.locals["data"] = project;
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
    const project = await Projects.find({
      where: {
        id: id,
      },
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
                  },
                },
              },
            },
          },
        },
      },
    });

    res.locals["data"] = project;
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

    const projects = await Projects.findMany({
      skip,
      take,
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
                  },
                },
              },
            },
          },
        },
      },
    });

    res.locals["data"] = projects;
    next();
  } catch (error) {
    next(error);
  }
});

export default router;
