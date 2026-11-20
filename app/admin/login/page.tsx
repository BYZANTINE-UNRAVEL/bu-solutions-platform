"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/login/actions";

const initial: LoginState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, initial);

  return (
    <main className="mx-auto max-w-md px-5 py-20">
      <p className="m-0 text-xs tracking-[0.16em] uppercase">Byzantine Unravel</p>
      <h1 className="mt-3 font-serif text-4xl font-normal">Desk</h1>
      <form action={action} className="mt-8 grid gap-4">
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {state.formError ? <p className="m-0 text-sm text-oxide">{state.formError}</p> : null}
        <button type="submit" disabled={pending}>
          {pending ? "Signing in" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
