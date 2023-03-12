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
        "password must contain at least one uppercase letter, one lowercase letter, one digit, and one special"
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
    email: yup.string().email().optional(),
    semester: yup.number().optional(),
    password: yup
      .string()
      .min(8, "password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%*?_&]{8,}$/,
        "password must contain at least one uppercase letter, one lowercase letter, one digit, and one special"
      )
      .optional(),
  })
  .noUnknown(true)
  .strict(true);

const find = yup.object().shape({ id: yup.number().required() });

const findManyInvite = yup.object().shape({
  groupId: yup.number().required(),
  search: yup.string().optional(),
  skip: yup.number().required(),
  take: yup.number().required(),
});

const login = yup.object().shape({
  enrollmentNo: yup.string().length(12).required(),
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
  findManyInvite,
};
