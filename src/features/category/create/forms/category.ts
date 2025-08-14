import { categoryNameSchema } from "@/schemas/category";
import z from "zod";

export const categoryFormSchema = z.object({
    id: z.number().optional(),
    name: categoryNameSchema,
    description: z.string().optional(),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
