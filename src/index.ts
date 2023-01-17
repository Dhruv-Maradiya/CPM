import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import process from "process";
import path from "path";
import Academics from "./src/routes/academics/index.js";
import BackendTechnologies from "./src/routes/backendTechnologies/index.js";
import Branches from "./src/routes/branches/index.js";
import DatabaseTechnologies from "./src/routes/databaseTechnologies/index.js";
import Faculty from "./src/routes/faculty/index.js";
import FrontendTechnologies from "./src/routes/frontendTechnologies/index.js";
import Groups from "./src/routes/groups/index.js";
import InvitationForGroup from "./src/routes/invitationForGroup/index.js";
import MediaComments from "./src/routes/mediaComments/index.js";
import Notifications from "./src/routes/notifications/index.js";
import Projects from "./src/routes/projects/index.js";
import Tasks from "./src/routes/tasks/index.js";
import Students from "./src/routes/students/index.js";
import url from "url";
import {
  errorHandler as exceptionMiddleware,
  response as responseHandler,
} from "./middleware/index.js";
import { NotFoundError } from "./exceptions/index.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env["PORT"] as unknown as number;

//
// ########## MIDDLEWARE ##########
//

// logging

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// serving static files
app.use("/public", express.static(path.join(__dirname, "../", "public")));

//
// ########## ROUTES ##########
//
app.use("/api/v1/academic", Academics);
app.use("/api/v1/backendTechnology", BackendTechnologies);
app.use("/api/v1/branch", Branches);
app.use("/api/v1/databaseTechnology", DatabaseTechnologies);
app.use("/api/v1/faculty", Faculty);
app.use("/api/v1/frontendTechnology", FrontendTechnologies);
app.use("/api/v1/group", Groups);
app.use("/api/v1/invitationForGroup", InvitationForGroup);
app.use("/api/v1/mediaComment", MediaComments);
app.use("/api/v1/notification", Notifications);
app.use("/api/v1/project", Projects);
app.use("/api/v1/student", Students);
app.use("/api/v1/task", Tasks);

//
// ########## MIDDLEWARE ##########
//
app.use(responseHandler);

app.all("*", (_req, _res, next) => {
  const error = new NotFoundError("Page not found");
  next(error);
});

// exception middleware
app.use(exceptionMiddleware);

// ########## SERVER ##########
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
