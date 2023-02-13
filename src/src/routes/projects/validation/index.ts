import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    name: yup.string().required(),
    academicId: yup.number().required(),
    frontendTechnologyId: yup.number().required(),
    databaseTechnologyId: yup.number().required(),
    backendTechnologyId: yup.number().required(),
    groupId: yup.number().required(),
    description: yup.string().required(),
  })
  .noUnknown(true)
  .strict(true);

const update = yup
  .object()
  .shape({
    id: yup.number().required(),
    name: yup.string().optional(),
    academicId: yup.number().optional(),
    frontendTechnologyId: yup.number().optional(),
    databaseTechnologyId: yup.number().optional(),
    backendTechnologyId: yup.number().optional(),
    groupId: yup.number().optional(),
    description: yup.string().optional(),
  })
  .noUnknown(true)
  .strict(true);

const find = yup.object().shape({ id: yup.number().required() });

export default {
  create,
  update,
  find,
};
