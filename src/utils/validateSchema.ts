import { ValidationError } from "../exceptions/index.js";
import yup from "yup";

const validateSchema = <T>(
  schema: yup.AnySchema,
  data: unknown,
  cast: boolean
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    try {
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
          const newError = new ValidationError(error.message);
          return reject(newError);
        });
    } catch (error) {
      return reject(error);
    }
  });
};

export default validateSchema;
