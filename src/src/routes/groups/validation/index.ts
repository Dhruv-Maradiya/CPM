import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    name: yup.string().required(),
    leaderId: yup.number().required(),
  })
  .noUnknown(true)
  .strict(true);

const update = yup
  .object()
  .shape({
    id: yup.number().required(),
    name: yup.string().optional(),
    leaderId: yup.number().optional(),
  })
  .noUnknown(true)
  .strict(true);

const find = yup.object().shape({ id: yup.number().required() });

export default {
  create,
  update,
  find,
};
