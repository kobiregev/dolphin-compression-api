import { string, object, TypeOf } from "zod";

const onlyDigits = /^[0-9]+$/;

export const compressVideoSchema = {
  query: object({
    width: string({
      required_error: "width is required",
    }).regex(onlyDigits, { message: "Only digits allowed" }),
    height: string({
      required_error: "height is required",
    }).regex(onlyDigits, { message: "Only digits allowed" }),
  }),
};

export type CompressVideoQuery = TypeOf<typeof compressVideoSchema.query>;
