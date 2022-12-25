import { yup } from "../../../../utils";

const create = yup
  .object()
  .shape({
    roleId: yup.number().required(),
    employeeId: yup.string().max(15).required(),
    name: yup.string().max(255).required(),
    password: yup
      .string()
      .required()
      .min(8, "password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "must contain at least one uppercase letter, one lowercase letter, one digit, and one special"
      ),
    email: yup.string().email().required(),
    number: yup
      .string()
      .matches(/a/, "number must be a valid number")
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
    number: yup
      .string()
      .matches(/a/, "number must be a valid number")
      .optional(),
  })
  .noUnknown(true)
  .strict(true);

const find = yup.object().shape({ id: yup.number().required() });

export default {
  create,
  update,
  find,
};
