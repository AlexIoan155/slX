import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[0-9\s.-]{7,20}$/, "Numărul de telefon nu este valid")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().max(200, "Adresa e prea lungă").optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
