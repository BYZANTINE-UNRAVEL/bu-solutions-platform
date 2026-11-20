"use client";

import { startTransition, useActionState } from "react";
import { savePage, type FormState } from "@/app/admin/actions";

const initial: FormState = {};

export function PageForm({
  page,
}: {
  page: { key: string; title: string; description: string; canonicalPath: string; heading: string; body: string };
}) {
  const [state, submit, pending] = useActionState(savePage, initial);
  return (
    <form
      className="grid max-w-2xl gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => submit(data));
      }}
    >
      <input type="hidden" name="key" value={page.key} />
      {state.ok ? <p className="m-0 border border-line bg-panel px-3 py-2 text-sm">Saved.</p> : null}
      <label className="field">
        <span>SEO title</span>
        <input name="title" defaultValue={page.title} />
        <em className="text-xs text-muted not-italic">{page.title.length} / 70</em>
      </label>
      <label className="field">
        <span>SEO description</span>
        <textarea name="description" defaultValue={page.description} className="min-h-24" />
        <em className="text-xs text-muted not-italic">{page.description.length} / 160</em>
      </label>
      <label className="field">
        <span>Canonical path</span>
        <input name="canonicalPath" defaultValue={page.canonicalPath} />
      </label>
      <label className="field">
        <span>Heading</span>
        <input name="heading" defaultValue={page.heading} />
      </label>
      <label className="field">
        <span>Body</span>
        <textarea name="body" defaultValue={page.body} className="min-h-56" />
      </label>
      {state.fieldErrors ? (
        <ul className="m-0 text-sm text-oxide">
          {Object.entries(state.fieldErrors).map(([key, message]) => (
            <li key={key}>
              {key}: {message}
            </li>
          ))}
        </ul>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Saving" : "Save page"}
      </button>
    </form>
  );
}
