import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    sem: yup.number().required(),
    year: yup.number().required(),
    maximumGroupMember: yup.number().required(),
  })
  .noUnknown(true)
  .strict(true);

const update = yup
  .object()
  .shape({
    id: yup.number().required(),
    sem: yup.number().optional(),
    year: yup.number().optional(),
    maximumGroupMember: yup.number().optional(),
  })
  .noUnknown(true)
  .strict(true);

const find = yup.object().shape({ id: yup.number().required() });

export default {
  create,
  update,
  find,
};
