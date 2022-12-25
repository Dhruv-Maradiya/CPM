import { yup } from "../../../../utils/index.js";

const create = yup
  .object()
  .shape({
    memberId: yup.number().required(),
    groupLeaderId: yup.number().required(),
    groupId: yup.number().required(),
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
};
