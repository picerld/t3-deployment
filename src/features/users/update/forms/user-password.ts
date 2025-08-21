import z from "zod";

// export const userPasswordFormSchema = z.object({
//   id: z.string(),
//   oldPassword: z.string().min(6, "Password lama minimal 6 karakter"),
//   password: z.string().min(6, "Password baru minimal 6 karakter"),
//   confirmPassword: z.string().min(6),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Konfirmasi password tidak sama",
//   path: ["confirmPassword"],
// });

export const userPasswordFormSchema = z.object({
  id: z.string(),
  password: z.string().min(6, "Password baru minimal 6 karakter"),
});


export type UserPasswordFormSchema = z.infer<typeof userPasswordFormSchema>;