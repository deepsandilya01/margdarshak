import { z } from "zod";

export const saveItemSchema = z.object({
  type: z.enum(["standard", "qco", "lab", "answer", "source", "resource"], {
    required_error: "Item type is required",
    invalid_type_error: "Invalid item type",
  }),
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty"),
  referenceId: z
    .string({ required_error: "Reference ID is required" })
    .trim()
    .min(1, "Reference ID cannot be empty"),
  metadata: z.record(z.unknown()).optional(),
  sourceUrl: z.string().url("Please provide a valid URL").optional().nullable(),
});
