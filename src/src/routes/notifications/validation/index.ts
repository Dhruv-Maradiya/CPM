import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    message: yup.string().required(),
    toUsers: yup.string().required(),
  })
  .noUnknown(true)
  .strict(true);

const findManyByFaculty = yup
  .object()
  .shape({ facultyId: yup.number().required() });

export default {
  create,
  findManyByFaculty,
};
