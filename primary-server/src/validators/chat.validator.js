import { z } from "zod";

export const chatSchema = z.object({
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message cannot be empty"),
  sessionId: z.string().trim().optional(),
  language: z.string().trim().default("en"),
  context: z.record(z.unknown()).optional(),
});
