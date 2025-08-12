import z from "zod";

export const locationNameSchema = z
    .string()
    .min(3, { message: "Nama ruangan minimal 3 karakter" })
    .max(20, { message: "Nama ruangan maksimal 20 karakter" });