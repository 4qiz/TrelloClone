import { z } from "zod";

export const UpdateList = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Название слишком короткое.",
    }),
  id: z.string(),
  boardId: z.string(),
});
