import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard title="Login to GymOS" subtitle="Open your gym dashboard.">
      <LoginForm />
    </AuthCard>
  );
}
