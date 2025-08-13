import z from "zod";

export const usernameSchema = z
    .string()
    .max(20, { message: "Username maksimal 20 karakter" }).optional();

export const nameSchema = z
    .string()
    .min(3, { message: "Nama minimal 3 karakter" })
    .max(50, { message: "Nama maksimal 20 karakter" });

export const passwordSchema = z
    .string().optional();

export const roleSchema = z.number({
    message: "Pilih role!",
});
