import { ResetPasswordForm } from "@/src/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // If the token is valid, render the ResetPasswordForm with the verified email
  return <ResetPasswordForm />;
}
