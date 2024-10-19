import { createClient } from "@/utils/supabase/server";

// Add this function somewhere in your component
const testEmailSend = async () => {
  const supabase = createClient();
  console.log("Sending test email");
  const { error } = await supabase.auth.resetPasswordForEmail(
    "test@example.com",
    {
      redirectTo: "http://localhost:3000/reset-password",
    },
  );
  if (error) {
    console.error("Error sending test email:", error);
  } else {
    console.log("Test email sent successfully");
  }
};

// Call this function when testing
// testEmailSend();

export default function TestPage() {
  testEmailSend();
  return <div>Test</div>;
}
