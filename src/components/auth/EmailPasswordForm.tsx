"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormValues } from "@/src/lib/schemas/auth";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { AlertTriangle } from "lucide-react";

interface EmailPasswordFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  onResetPassword: () => void;
  loginError: string | null;
}

export default function EmailPasswordForm({ onSubmit, onResetPassword, loginError }: EmailPasswordFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-postadress</FormLabel>
              <FormControl>
                <Input {...field} type="email" className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lösenord</FormLabel>
              <FormControl>
                <Input {...field} type="password" className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-sm text-primary underline hover:no-underline"
          onClick={onResetPassword}
        >
          Glömt lösenordet?
        </Button>
        <Button type="submit" className="w-full bg-primary text-primary-foreground">
          Logga in
        </Button>

        {loginError && (
          <div className="flex items-center mt-3 p-3 bg-red-50 rounded-md border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-sm text-red-700">{loginError}</span>
          </div>
        )}
      </form>
    </Form>
  );
}
