import { Suspense } from "react";
import LoginPageContent from "@/src/components/auth/LoginPageContent";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}