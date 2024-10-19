import * as z from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Lösenordet måste vara minst 8 tecken långt")
  .regex(/[A-Z]/, "Lösenordet måste innehålla minst en stor bokstav")
  .regex(/[a-z]/, "Lösenordet måste innehålla minst en liten bokstav")
  .regex(/[0-9]/, "Lösenordet måste innehålla minst en siffra");

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress" }),
  password: passwordSchema.optional(),
  subscribeNewsletter: z.boolean().optional(),
  acceptTerms: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
