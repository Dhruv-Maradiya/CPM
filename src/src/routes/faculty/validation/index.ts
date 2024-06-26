import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    role: yup.string().oneOf(["HOD", "LECTURER"]).required(),
    employeeId: yup.string().max(15).required(),
    name: yup.string().max(255).required(),
    password: yup
      .string()
      .required()
      .min(8, "password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%*?_&]{8,}$/,
        "must contain at least one uppercase letter, one lowercase letter, one digit, and one special"
      ),
    email: yup.string().email().required(),
    number: yup
      .string()
      .matches(/^[0-9]{10}$/, "number must be a valid number")
      .required(),
    createdById: yup.number().required(),
  })
  .noUnknown(true)
  .strict(true);

const update = yup
  .object()
  .shape({
    id: yup.number().required(),
    roleId: yup.number().optional(),
    employeeId: yup.string().max(15).optional(),
    name: yup.string().max(255).optional(),
    email: yup.string().email().optional(),
    isBlocked: yup.boolean().optional(),
    number: yup
      .string()
      .matches(/^[0-9]{10}$/, "number must be a valid number")
      .optional(),
    password: yup
      .string()
      .optional()
      .min(8, "password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%*?_&]{8,}$/,
        "must contain at least one uppercase letter, one lowercase letter, one digit, and one special"
      ),
  })
  .noUnknown(true)
  .strict(true);

const find = yup.object().shape({ id: yup.number().required() });

const login = yup.object().shape({
  employeeId: yup.string().max(15).required(),
  password: yup
    .string()
    .required()
    .min(8, "password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%*?_&]{8,}$/,
      "must contain at least one uppercase letter, one lowercase letter, one digit, and one special"
    ),
});

export default {
  create,
  update,
  find,
  login,
};
