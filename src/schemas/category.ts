import z from "zod";

export const categoryNameSchema = z
    .string()
    .min(3, { message: "Kategori minimal 3 karakter" })
    .max(20, { message: "Kategori maksimal 20 karakter" });