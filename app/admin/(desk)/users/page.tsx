import { deleteUser } from "@/app/admin/actions";
import { NewUserForm, SetPasswordForm } from "@/components/user-forms";
import { requireDeskUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatWhen } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await requireDeskUser();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <h1 className="mt-0 font-serif text-4xl font-normal">Users</h1>
      <p className="max-w-xl text-muted">
        Everyone here can edit the whole desk, read enquiries, and add or remove other users.
      </p>
      <div className="mb-12 grid gap-4">
        {users.map((user) => (
          <article key={user.id} className="grid gap-4 border border-line p-4 md:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <h2 className="m-0 font-serif text-2xl font-normal">
                {user.name}
                {user.id === me.id ? <span className="ml-2 text-sm text-muted">(you)</span> : null}
              </h2>
              <p className="m-0 text-sm">{user.email}</p>
              <p className="m-0 mt-1 text-sm text-muted">Added {formatWhen(user.createdAt)}</p>
            </div>
            {user.id === me.id ? (
              <p className="m-0 text-sm text-muted">Change your own password on the Account page.</p>
            ) : (
              <div className="grid gap-3">
                <SetPasswordForm userId={user.id} />
                <form action={deleteUser}>
                  <input type="hidden" name="id" value={user.id} />
                  <button type="submit" className="secondary">
                    Remove {user.name}
                  </button>
                </form>
              </div>
            )}
          </article>
        ))}
      </div>
      <h2 className="font-serif text-3xl font-normal">Add a user</h2>
      <NewUserForm />
    </>
  );
}
