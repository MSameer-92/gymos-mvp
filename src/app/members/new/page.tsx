import { MemberForm } from "@/components/MemberForm";

export default function NewMemberPage() {
  return (
    <div className="relative z-10 min-h-screen bg-transparent p-6 -m-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">New Member</h2>
        <p className="text-gray-300">Create a new gym member.</p>
      </div>
      <MemberForm />
    </div>
  );

}
