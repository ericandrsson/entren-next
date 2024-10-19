"use client";

import LoginForm from "@/src/components/auth/LoginForm";
import { RequestResetPasswordForm } from "@/src/components/auth/RequestResetPasswordForm";
import { useToast } from "@/src/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
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

    // Check if the 'reset' query parameter is present
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
        <LoginForm onResetPassword={() => setShowResetPassword(true)} />
      )}
    </>
  );
}
