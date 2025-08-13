import z from "zod";

export const usernameSchema = z
    .string()
    .max(20, { message: "Username maksimal 20 karakter" }).optional();

export const passwordSchema = z
    .string().optional();
