"use client";

import { RequestResetPasswordForm } from "@/src/components/auth/RequestResetPasswordForm";
import SignInForm from "@/src/components/auth/SignInForm";
import { useToast } from "@/src/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const storedToast = localStorage.getItem("authToast");
    if (storedToast) {
      const toastData = JSON.parse(storedToast);
      toast(toastData);
      localStorage.removeItem("authToast");
    }

    if (searchParams.get("reset") === "true") {
      setShowResetPassword(true);
    }
  }, [toast, searchParams]);

  return (
    <>
      {showResetPassword ? (
        <RequestResetPasswordForm
          onCancel={() => setShowResetPassword(false)}
        />
      ) : (
        <SignInForm onResetPassword={() => setShowResetPassword(true)} />
      )}
    </>
  );
}
