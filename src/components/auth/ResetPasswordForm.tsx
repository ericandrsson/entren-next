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
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { logger } from "@/src/libs/logger";

const log = logger.child({
  component: "ResetPasswordForm",
});
  
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

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      log.debug("Starting password update process");
      const { data, error } = await supabase.auth.updateUser({
        password: values.password,
      });
      log.debug("Supabase response:", { data, error });

      if (error) throw error;

      if (data.user) {
        log.debug("Password updated successfully");
        router.push("/");
      } else {
        throw new Error("No user data returned");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error instanceof Error) {
        if (error.message === "Auth session missing!") {
          setError("Lösenordsåterställning misslyckades. Återställningslänken har tyvärr gått ut. Klicka här för att få en ny länk.");
        } else if (error.message === "New password should be different from the old password.") {
          setError("Det nya lösenordet måste vara annorlunda än det gamla lösenordet.");
        } else {
          setError(`Det gick inte att uppdatera lösenordet: ${error.message}`);
        }
      } else {
        setError("Ett oväntat fel inträffade. Försök igen.");
      }
    } finally {
      setIsLoading(false);
      log.debug("Password update process completed");
    }
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Välj nytt lösenord</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nytt lösenord</FormLabel>
                <FormControl>
                  <Input {...field} type="password" className="bg-white" />
                </FormControl>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
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

      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-200">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h4 className="font-semibold text-red-700">
              Lösenordsåterställning misslyckades
            </h4>
          </div>
          <p className="text-sm text-red-700">
            {error.includes("Klicka här") ? (
              <>
                {error.split("Klicka här")[0]}
                <Link
                  href="/auth/sign-in?reset=true"
                  className="underline hover:text-red-800"
                >
                  Klicka här
                </Link>
                {error.split("Klicka här")[1]}
              </>
            ) : (
              error
            )}
          </p>
        </div>
      )}
    </div>
  );
}
