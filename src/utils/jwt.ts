import jwt, { Secret } from "jsonwebtoken";

type UserType = "STUDENT" | "FACULTY";

type Student = {
  id: number;
  identifier: string;
  type: UserType;
};

type Faculty = {
  id: number;
  identifier: string;
  type: UserType;
};

const SECRET_KEY = process.env["JWT_SECRET_KEY"] as Secret;
const sign = (payload: Student | Faculty) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: "30 days",
      });
      return resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

const verify = (token: string) => {
  return new Promise<Student | Faculty>((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as Student | Faculty;
      return resolve(decoded);
    } catch (error) {
      reject(error);
    }
  });
};

export { sign, verify };
