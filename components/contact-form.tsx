"use client";

import Script from "next/script";
import { useActionState } from "react";
import { sendEnquiry, type EnquiryState } from "@/app/(site)/contact/actions";
import { turnstileSiteKey } from "@/lib/public-flags";

const initial: EnquiryState = {};

export function ContactForm({ products }: { products: { slug: string; name: string }[] }) {
  const [state, submit, pending] = useActionState(sendEnquiry, initial);
  const siteKey = turnstileSiteKey();

  if (state.ok) {
    return (
      <p className="border border-line bg-panel px-4 py-4" role="status">
        The enquiry is with the desk. Someone will reply to the address you gave.
      </p>
    );
  }

  return (
    <form
      className="grid max-w-xl gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        submit(new FormData(event.currentTarget));
      }}
    >
      <label className="field">
        <span>Name</span>
        <input name="name" autoComplete="name" required />
        {state.fieldErrors?.name ? <em className="text-sm text-oxide not-italic">{state.fieldErrors.name}</em> : null}
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
        {state.fieldErrors?.email ? <em className="text-sm text-oxide not-italic">{state.fieldErrors.email}</em> : null}
      </label>
      <label className="field">
        <span>Organisation</span>
        <input name="organisation" autoComplete="organization" />
      </label>
      <label className="field">
        <span>Phone</span>
        <input name="phone" autoComplete="tel" />
      </label>
      <label className="field">
        <span>Product</span>
        <select name="productInterest" defaultValue="">
          <option value="">Not sure yet</option>
          {products.map((product) => (
            <option key={product.slug} value={product.slug}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Message</span>
        <textarea name="message" required />
        {state.fieldErrors?.message ? (
          <em className="text-sm text-oxide not-italic">{state.fieldErrors.message}</em>
        ) : null}
      </label>
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {siteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={siteKey} />
        </>
      ) : null}
      {state.formError ? <p className="m-0 text-sm text-oxide">{state.formError}</p> : null}
      <button type="submit" disabled={pending}>
        {pending ? "Sending" : "Send the enquiry"}
      </button>
    </form>
  );
}
