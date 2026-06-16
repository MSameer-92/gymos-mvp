import { AuthCard } from "@/components/AuthCard";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <AuthCard title="Create GymOS Account" subtitle="Create your gym workspace and start managing members.">
      <SignupForm />
    </AuthCard>
  );
}
