import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Adresa de email este obligatorie")
  .email("Adresa de email nu este validă");

export const passwordSchema = z
  .string()
  .min(8, "Parola trebuie să aibă cel puțin 8 caractere")
  .regex(/[a-z]/, "Parola trebuie să conțină cel puțin o literă mică")
  .regex(/[A-Z]/, "Parola trebuie să conțină cel puțin o literă mare")
  .regex(/[0-9]/, "Parola trebuie să conțină cel puțin o cifră");

export const registerSchema = z
  .object({
    name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere").max(80),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu coincid",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Parola este obligatorie"),
  rememberMe: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu coincid",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
