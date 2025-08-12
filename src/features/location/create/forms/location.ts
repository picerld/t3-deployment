import { locationNameSchema } from "@/schemas/location";
import z from "zod";

export const locationFormSchema = z.object({
    name: locationNameSchema,
    description: z.string().optional(),
});

export type LocationFormSchema = z.infer<typeof locationFormSchema>;
