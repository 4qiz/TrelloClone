import { CardStatus } from "@prisma/client";
import { z } from "zod";

export const UpdateCard = z.object({
  boardId: z.string(),
  description: z.optional(
    z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description is required",
      })
      .min(3, {
        message: "Description is too short.",
      })
  ),
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
      })
      .min(3, {
        message: "Название слишком короткое.",
      })
  ),
  id: z.string(),

  deadlineDate: z.optional(
    z.date({
      required_error: "Deadline date is required",
      invalid_type_error: "Deadline date must be a valid date string",
    })
  ),
  status: z.optional(z.nativeEnum(CardStatus)),
});
