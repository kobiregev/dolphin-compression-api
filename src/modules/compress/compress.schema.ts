import { string, object, TypeOf } from "zod";

// only digits
const onlyDigits = /^[0-9]+$/;
// only digits, 1 or 2 characters max combination is 50
const compressionRegex = /^(0?[1-9]|[1-4][0-9]|50)$/;

export const compressFileSchema = {
  query: object({
    width: string({
      required_error: "width is required",
    }).regex(onlyDigits, { message: "Only digits allowed" }),
    height: string({
      required_error: "height is required",
    }).regex(onlyDigits, { message: "Only digits allowed" }),
    compression: string()
      .regex(compressionRegex, { message: "Maximum allowed value is 50" })
      .optional(),
  }),
};
export type CompressFileQuery = TypeOf<typeof compressFileSchema.query>;
