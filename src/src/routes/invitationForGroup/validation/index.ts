import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    members: yup.array().of(yup.number().required()).required().min(1),
    groupLeaderId: yup.number().required(),
    groupId: yup.number().required(),
  })
  .noUnknown(true)
  .strict(true);

const update = yup
  .object()
  .shape({
    status: yup.string().required().oneOf(["ACCEPTED", "REJECTED"]),
    id: yup.number().required(),
  })
  .noUnknown(true)
  .strict(true);

const findManyByStudent = yup
  .object()
  .shape({ studentId: yup.number().required() });
const findManyByLeader = yup
  .object()
  .shape({ leaderId: yup.number().required() });

export default {
  create,
  findManyByStudent,
  findManyByLeader,
  update,
};
