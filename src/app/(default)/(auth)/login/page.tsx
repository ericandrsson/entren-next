"use client";

import LoginForm from "@/src/components/auth/LoginForm";
import { useToast } from "@/src/hooks/use-toast";
import { useEffect } from "react";

export default function LoginPage() {
  const { toast } = useToast();

  useEffect(() => {
    const storedToast = localStorage.getItem("authToast");
    if (storedToast) {
      const toastData = JSON.parse(storedToast);
      toast(toastData);
      localStorage.removeItem("authToast");
    }
  }, [toast]);

  return (
    <div className="flex justify-center bg-white">
      <LoginForm />
    </div>
  );
}
