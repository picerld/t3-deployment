import { locationNameSchema } from "@/schemas/location";
import z from "zod";

export const locationFormSchema = z.object({
    id: z.number().optional(),
    name: locationNameSchema,
    description: z.string().optional(),
});

export type LocationFormSchema = z.infer<typeof locationFormSchema>;
