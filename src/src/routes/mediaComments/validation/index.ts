import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    mediaId: yup.number().required(),
    comment: yup.string().min(5).required(),
    commentedBy: yup.number().required(),
  })
  .noUnknown(true)
  .strict(true);

const findMany = yup.object().shape({ mediaId: yup.number().required() });

export default {
  create,
  findMany,
};
