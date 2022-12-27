import { yup } from "../../../../utils/index.js";

const isValidDate = (d: Date): boolean => {
  return d instanceof Date && !isNaN(d.getTime());
};

const create = yup
  .object()
  .shape(
    {
      projectId: yup.number().required(),
      name: yup.string().required(),
      description: yup.string().required(),
      priority: yup.number().required().min(1).max(10),
      assignedToParticipantId: yup.number().required(),
      startTime: yup
        .mixed()
        .test("testDate", "startTime must be a valid date", (val) => {
          if (val === undefined || val === null) {
            return true;
          } else {
            const newDate = new Date(val);
            return isValidDate(newDate);
          }
        })
        .optional(),
      endTime: yup
        .mixed()
        .test("testDate", "endTime must be a valid date", (val) => {
          if (val === undefined || val === null) {
            return true;
          } else {
            const newDate = new Date(val);
            return isValidDate(newDate);
          }
        })
        .optional(),
      createdByLeaderId: yup
        .number()
        .optional()
        .nullable()
        .when("createdByFacultyId", {
          is: (val: number | null) => val,
          then: yup.number().strip(true),
          otherwise: yup
            .number()
            .required(
              "One of the following is required createdByLeaderId or createdByFacultyId"
            ),
        }),
      createdByFacultyId: yup
        .number()
        .optional()
        .nullable()
        .when("createdByLeaderId", {
          is: (val: number | null) => val,
          then: yup.number().strip(true),
          otherwise: yup
            .number()
            .required(
              "One of the following is required createdByLeaderId or createdByFacultyId"
            ),
        }),
    },
    [["createdByLeaderId", "createdByFacultyId"]]
  )
  .noUnknown(true)
  .strict(true);

const update = yup
  .object()
  .shape({
    id: yup.number().required(),
    name: yup.string().optional(),
    description: yup.string().optional(),
    priority: yup.number().optional().min(1).max(10),
    startTime: yup.date().optional(),
    endTime: yup.date().optional(),
    status: yup.string().optional(),
  })
  .noUnknown(true)
  .strict(true);

const findMany = yup.object().shape({ studentId: yup.number().required() });
const findManyByProject = yup
  .object()
  .shape({ projectId: yup.number().required() });
const findManyByProjectFaculty = yup
  .object()
  .shape({ facultyId: yup.number().required() });

export default {
  create,
  update,
  findMany,
  findManyByProject,
  findManyByProjectFaculty,
};
