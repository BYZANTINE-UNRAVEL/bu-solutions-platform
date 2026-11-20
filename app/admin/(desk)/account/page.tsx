import { ChangePasswordForm } from "@/components/user-forms";
import { requireDeskUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireDeskUser();
  return (
    <>
      <h1 className="mt-0 font-serif text-4xl font-normal">Account</h1>
      <p className="max-w-xl text-muted">
        Signed in as {user.name} ({user.email}). Changing the password signs out every other browser where you are signed in.
      </p>
      <ChangePasswordForm />
    </>
  );
}
