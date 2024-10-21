import AuthFlowComponent from "@/src/components/auth/AuthFlowComponent";
import { redirect } from "next/navigation";

async function handleAuth(formData: FormData) {
  "use server";

  // Here you would typically handle the authentication logic
  // For example, validating the user, creating a session, etc.

  // This is a placeholder implementation
  const email = formData.get("email");
  const password = formData.get("password");

  if (email === "test@example.com" && password === "password") {
    // Successful login
    redirect("/dashboard");
  } else {
    // Failed login
    // In a real implementation, you'd want to communicate this back to the client
    console.error("Login failed");
  }
}

export default function AuthFlow() {
  return (
    <div className="sm:grow sm:flex sm:justify-center sm:items-start sm:px-4 lg:px-0 bg-background">
      <AuthFlowComponent onSubmit={handleAuth} />
    </div>
  );
}
