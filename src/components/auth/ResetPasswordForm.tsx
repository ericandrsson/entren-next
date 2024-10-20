"use client";

import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { passwordSchema } from "@/src/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

type ResetPasswordFormProps = {
  resetPassword: (password: string) => Promise<{ error?: string }>;
};

export function ResetPasswordForm({ resetPassword }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      const result = await resetPassword(values.password);
      if (result.error) {
        throw new Error(result.error);
      }
      // The server action will handle the redirect if successful
    } catch (error) {
      if (error instanceof Error) {
        setResetError(error.message);
      } else {
        setResetError("Ett oväntat fel inträffade. Försök igen.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Välj nytt lösenord</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nytt lösenord</FormLabel>
                <FormControl>
                  <Input {...field} type="password" className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bekräfta nytt lösenord</FormLabel>
                <FormControl>
                  <Input {...field} type="password" className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Uppdaterar..." : "Uppdatera lösenord"}
          </Button>
        </form>
      </Form>

      {resetError && (
        <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-200">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h4 className="font-semibold text-red-700">
              Lösenordsåterställning misslyckades
            </h4>
          </div>
          <p className="text-sm text-red-700">{resetError}</p>
        </div>
      )}
    </div>
  );
}
