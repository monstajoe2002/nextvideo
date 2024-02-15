import { z } from "zod";

export const UploadVideoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  tags: z.string(),
});
export const EditVideoSchema = UploadVideoSchema.partial().omit({
  thumbnail: true,
});
