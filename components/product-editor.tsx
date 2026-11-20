"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProduct, type FormState } from "@/app/admin/actions";

type FeatureDraft = { title: string; body: string };

type ProductDraft = {
  id: string;
  slug: string;
  name: string;
  code: string;
  summary: string;
  introduction: string;
  audience: string;
  onlineEnabled: boolean;
  offlineEnabled: boolean;
  onlineSummary: string;
  offlineSummary: string;
  onlineDetail: string;
  offlineDetail: string;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  features: FeatureDraft[];
};

const initial: FormState = {};

export function ProductEditor({ product }: { product: ProductDraft }) {
  const [state, submit, pending] = useActionState(saveProduct, initial);
  const [features, setFeatures] = useState(product.features);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  function updateFeature(index: number, patch: Partial<FeatureDraft>) {
    setFeatures((current) => current.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)));
  }

  return (
    // Submitted through onSubmit, not the action prop: React resets a form after an
    // action-prop submit, which would throw away unsaved edits when validation fails.
    <form
      className="grid max-w-3xl gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => submit(data));
      }}
    >
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="features" value={JSON.stringify(features)} />
      {state.ok ? <p className="m-0 border border-line bg-panel px-3 py-2 text-sm">Saved.</p> : null}
      {state.formError ? <p className="m-0 text-sm text-oxide">{state.formError}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" name="name" defaultValue={product.name} error={state.fieldErrors?.name} />
        <Field label="Code" name="code" defaultValue={product.code} error={state.fieldErrors?.code} />
        <Field label="Address" name="slug" defaultValue={product.slug} error={state.fieldErrors?.slug} />
        <Field label="Order" name="sortOrder" defaultValue={String(product.sortOrder)} error={state.fieldErrors?.sortOrder} />
      </div>
      <Field label="One-line summary" name="summary" defaultValue={product.summary} error={state.fieldErrors?.summary} />
      <Field label="Who it is for" name="audience" defaultValue={product.audience} error={state.fieldErrors?.audience} />
      <Area label="What it does" name="introduction" defaultValue={product.introduction} error={state.fieldErrors?.introduction} />
      <p className="m-0 text-sm text-muted">Markdown. It is rendered as text, never as raw HTML.</p>

      <fieldset className="grid gap-4 border border-line p-4">
        <legend className="px-2">Online</legend>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="onlineEnabled" defaultChecked={product.onlineEnabled} className="w-auto" />
          Offered as an online web app
        </label>
        <Field label="Online summary" name="onlineSummary" defaultValue={product.onlineSummary} error={state.fieldErrors?.onlineSummary} />
        <Area label="Online detail" name="onlineDetail" defaultValue={product.onlineDetail} error={state.fieldErrors?.onlineDetail} />
      </fieldset>
      <fieldset className="grid gap-4 border border-line p-4">
        <legend className="px-2">On the premises</legend>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="offlineEnabled" defaultChecked={product.offlineEnabled} className="w-auto" />
          Offered as an on-premises web app
        </label>
        <Field label="On-premises summary" name="offlineSummary" defaultValue={product.offlineSummary} error={state.fieldErrors?.offlineSummary} />
        <Area label="On-premises detail" name="offlineDetail" defaultValue={product.offlineDetail} error={state.fieldErrors?.offlineDetail} />
      </fieldset>
      {state.fieldErrors?.onlineEnabled ? <p className="m-0 text-sm text-oxide">{state.fieldErrors.onlineEnabled}</p> : null}

      <div className="border-t border-line pt-4">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="m-0 font-serif text-2xl font-normal">Features</h2>
          <button
            type="button"
            className="secondary"
            onClick={() => setFeatures((current) => [...current, { title: "", body: "" }])}
          >
            Add a feature
          </button>
        </div>
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <div key={index} className="grid gap-3 border border-line p-3">
              <Fieldish label="Title" value={feature.title} onChange={(title) => updateFeature(index, { title })} />
              <label className="field">
                <span>Detail</span>
                <textarea value={feature.body} onChange={(event) => updateFeature(index, { body: event.target.value })} />
              </label>
              <button
                type="button"
                className="secondary"
                onClick={() => setFeatures((current) => current.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {state.fieldErrors?.features ? <p className="text-sm text-oxide">{state.fieldErrors.features}</p> : null}
      </div>

      <Field label="Image address" name="imageUrl" defaultValue={product.imageUrl} error={state.fieldErrors?.imageUrl} />
      <p className="m-0 text-sm text-muted">Optional https image. Social cards are generated from the title when this is blank.</p>
      <Field label="SEO title" name="seoTitle" defaultValue={product.seoTitle} error={state.fieldErrors?.seoTitle} />
      <Area label="SEO description" name="seoDescription" defaultValue={product.seoDescription} error={state.fieldErrors?.seoDescription} />
      <p className="m-0 text-sm text-muted">
        Public address: /products/{product.slug || "slug"}. Changing the address keeps the old one as a redirect.
      </p>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" defaultChecked={product.published} className="w-auto" />
        Published
      </label>
      <button type="submit" disabled={pending}>
        {pending ? "Saving" : "Save product"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  defaultValue: string;
  error?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} defaultValue={defaultValue} />
      {error ? <em className="text-sm text-oxide not-italic">{error}</em> : null}
    </label>
  );
}

function Area({
  label,
  name,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  defaultValue: string;
  error?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea name={name} defaultValue={defaultValue} />
      {error ? <em className="text-sm text-oxide not-italic">{error}</em> : null}
    </label>
  );
}

function Fieldish({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
