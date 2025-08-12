import { categoryNameSchema } from "@/schemas/category";
import z from "zod";

export const categoryFormSchema = z.object({
    name: categoryNameSchema,
    description: z.string().optional(),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
