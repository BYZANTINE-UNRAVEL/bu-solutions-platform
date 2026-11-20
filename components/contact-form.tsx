"use client";

import Script from "next/script";
import { startTransition, useActionState, useCallback, useEffect, useRef } from "react";
import { sendEnquiry, type EnquiryState } from "@/app/(site)/contact/actions";
import { turnstileSiteKey } from "@/lib/public-flags";

type Turnstile = {
  render(element: HTMLElement, options: { sitekey: string }): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const initial: EnquiryState = {};

export function ContactForm({ products }: { products: { slug: string; name: string }[] }) {
  const [state, submit, pending] = useActionState(sendEnquiry, initial);
  const siteKey = turnstileSiteKey();
  const widgetElement = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Rendered explicitly: the implicit .cf-turnstile scan runs once per script load,
  // so it misses the form when a visitor reaches /contact through an in-site link.
  const renderWidget = useCallback(() => {
    if (!siteKey || !widgetElement.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetElement.current, { sitekey: siteKey });
  }, [siteKey]);

  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [renderWidget]);

  // A token is good for one check. Fetch a fresh one after any failed submit.
  useEffect(() => {
    if (!state.ok && (state.formError || state.fieldErrors) && widgetId.current) {
      window.turnstile?.reset(widgetId.current);
    }
  }, [state]);

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
        const data = new FormData(event.currentTarget);
        startTransition(() => submit(data));
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
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={renderWidget} />
          <div ref={widgetElement} />
        </>
      ) : null}
      {state.formError ? <p className="m-0 text-sm text-oxide">{state.formError}</p> : null}
      <button type="submit" disabled={pending}>
        {pending ? "Sending" : "Send the enquiry"}
      </button>
    </form>
  );
}
