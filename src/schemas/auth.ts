import z from "zod";

export const usernameSchema = z
    .string()
    .min(3, { message: "Username minimal 3 karakter" })
    .max(20, { message: "Username maksimal 20 karakter" });

export const passwordSchema = z
    .string()
    .min(6, { message: "Isi password!" });
