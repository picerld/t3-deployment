import { passwordSchema, usernameSchema } from "@/schemas/auth";
import { nameSchema, roleSchema } from "@/schemas/user";
import z from "zod";

export const userFormSchema = z.object({
    name: nameSchema,
    username: usernameSchema,
    password: passwordSchema,
    roleId: roleSchema,
});

export type UserFormSchema = z.infer<typeof userFormSchema>;