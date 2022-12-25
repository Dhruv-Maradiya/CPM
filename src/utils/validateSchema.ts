import { ValidationError } from "../exceptions";
import yup from "yup";

const validateSchema = <T>(
  schema: yup.AnySchema,
  data: unknown,
  cast: boolean
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    if (cast) {
      data = schema.cast(data);
    }
    Promise.resolve(
      schema.validate(data, {
        abortEarly: true,
        stripUnknown: true,
      })
    )
      .then((data: T) => {
        return resolve(data);
      })
      .catch((error: yup.ValidationError) => {
        console.log(error);
        const newError = new ValidationError(error.message);
        return reject(newError);
      });
  });
};

export default validateSchema;
