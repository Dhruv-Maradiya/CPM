import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    name: yup.string().required(),
    academicId: yup.number().required(),
    leaderId: yup.number().required(),
  })
  .noUnknown(true)
  .strict(true);

const update = yup
  .object()
  .shape({
    id: yup.number().required(),
    name: yup.string().optional(),
    academicId: yup.number().optional(),
    leaderId: yup.number().optional(),
  })
  .noUnknown(true)
  .strict(true);

const addMembers = yup.object().shape({
  members: yup.array().of(yup.number().required()).required(),
  groupId: yup.number().required(),
});
const removeMember = yup.object().shape({
  member: yup.number().required(),
  groupId: yup.number().required(),
});

const find = yup.object().shape({ id: yup.number().required() });

export default {
  create,
  update,
  find,
  addMembers,
  removeMember,
};
