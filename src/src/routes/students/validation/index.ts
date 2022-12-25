import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    name: yup.string().max(255).required(),
    password: yup
      .string()
      .required()
      .min(8, "password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "must contain at least one uppercase letter, one lowercase letter, one digit, and one special"
      ),
    semester: yup.number().required(),
    branchId: yup.number().required(),
    enrollmentNo: yup.string().length(12).required(),
    email: yup.string().email().required(),
    number: yup
      .string()
      .matches(/^[0-9]{10}$/, "number must be a valid number")
      .required(),
  })
  .noUnknown(true)
  .strict(true);

const update = yup
  .object()
  .shape({
    id: yup.number().required(),
    name: yup.string().max(255).optional(),
    password: yup
      .string()
      .optional()
      .min(8, "password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "must contain at least one uppercase letter, one lowercase letter, one digit, and one special"
      ),
    semester: yup.number().optional(),
    branchId: yup.number().optional(),
    enrollmentNo: yup.string().length(12).optional(),
    email: yup.string().email().optional(),
    number: yup
      .string()
      .matches(/^[0-9]{10}$/, "number must be a valid number")
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
