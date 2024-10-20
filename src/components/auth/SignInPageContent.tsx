"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/src/hooks/use-toast";
import SignInForm from "@/src/components/auth/SignInForm";
import { RequestResetPasswordForm } from "@/src/components/auth/RequestResetPasswordForm";

export default function SignInPageContent() {
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