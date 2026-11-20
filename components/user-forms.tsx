"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { changePassword, createUser, setUserPassword, type FormState } from "@/app/admin/actions";

const initial: FormState = {};

function useDeskForm(action: (prev: FormState, formData: FormData) => Promise<FormState>) {
  const [state, submit, pending] = useActionState(action, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear password fields once the change has gone through.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  };
  return { state, pending, formRef, onSubmit };
}

function Input({
  label,
  name,
  type = "text",
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} />
      {error ? <em className="text-sm text-oxide not-italic">{error}</em> : null}
    </label>
  );
}

function Notes({ state, saved }: { state: FormState; saved: string }) {
  return (
    <>
      {state.ok ? <p className="m-0 border border-line bg-panel px-3 py-2 text-sm">{saved}</p> : null}
      {state.formError ? <p className="m-0 text-sm text-oxide">{state.formError}</p> : null}
    </>
  );
}

export function ChangePasswordForm() {
  const { state, pending, formRef, onSubmit } = useDeskForm(changePassword);
  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid max-w-md gap-4">
      <Notes state={state} saved="Password changed. Your other sessions are signed out." />
      <Input label="Current password" name="currentPassword" type="password" autoComplete="current-password" error={state.fieldErrors?.currentPassword} />
      <Input label="New password" name="newPassword" type="password" autoComplete="new-password" error={state.fieldErrors?.newPassword} />
      <Input label="New password again" name="confirmPassword" type="password" autoComplete="new-password" error={state.fieldErrors?.confirmPassword} />
      <button type="submit" disabled={pending}>
        {pending ? "Saving" : "Change password"}
      </button>
    </form>
  );
}

export function NewUserForm() {
  const { state, pending, formRef, onSubmit } = useDeskForm(createUser);
  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid max-w-md gap-4">
      <Notes state={state} saved="Added. Give them the password in person or by phone, and ask them to change it." />
      <Input label="Name" name="name" autoComplete="off" error={state.fieldErrors?.name} />
      <Input label="Email" name="email" type="email" autoComplete="off" error={state.fieldErrors?.email} />
      <Input label="First password" name="password" type="password" autoComplete="new-password" error={state.fieldErrors?.password} />
      <button type="submit" disabled={pending}>
        {pending ? "Adding" : "Add user"}
      </button>
    </form>
  );
}

export function SetPasswordForm({ userId }: { userId: string }) {
  const { state, pending, formRef, onSubmit } = useDeskForm(setUserPassword);
  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-2">
      <input type="hidden" name="userId" value={userId} />
      <Notes state={state} saved="New password set. They have been signed out." />
      <Input label="New password" name="password" type="password" autoComplete="new-password" error={state.fieldErrors?.password} />
      <button type="submit" className="secondary" disabled={pending}>
        {pending ? "Saving" : "Set password"}
      </button>
    </form>
  );
}
