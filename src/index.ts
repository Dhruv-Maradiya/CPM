import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import process from "process";
import path from "path";

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

//
// ########## MIDDLEWARE ##########
//

// exception middleware

// ########## SERVER ##########
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
