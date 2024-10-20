import { ResetPasswordForm } from "@/src/components/auth/ResetPasswordForm";
import { notFound, redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const code = searchParams.code as string | undefined;

  if (!code) {
    // Redirect to an error page or home page if no code is provided
    redirect(notFound());
  }

  // If the token is valid, render the ResetPasswordForm with the verified email
  return <ResetPasswordForm />;
}
