"use client";

import { useActionState } from "react";
import { saveSettings, type FormState } from "@/app/admin/actions";

const initial: FormState = {};

export function SettingsForm({
  values,
}: {
  values: {
    companyName: string;
    shortName: string;
    caption: string;
    introduction: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    enquiryRetentionMonths: number;
  };
}) {
  const [state, submit, pending] = useActionState(saveSettings, initial);
  return (
    <form
      className="grid max-w-2xl gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit(new FormData(event.currentTarget));
      }}
    >
      {state.ok ? <p className="m-0 border border-line bg-panel px-3 py-2 text-sm">Saved.</p> : null}
      <label className="field">
        <span>Company name</span>
        <input name="companyName" defaultValue={values.companyName} />
      </label>
      <label className="field">
        <span>Short name</span>
        <input name="shortName" defaultValue={values.shortName} />
      </label>
      <label className="field">
        <span>Caption</span>
        <input name="caption" defaultValue={values.caption} />
      </label>
      <label className="field">
        <span>Introduction</span>
        <textarea name="introduction" defaultValue={values.introduction} className="min-h-48" />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="contactEmail" defaultValue={values.contactEmail} />
      </label>
      <label className="field">
        <span>Phone</span>
        <input name="contactPhone" defaultValue={values.contactPhone} />
      </label>
      <label className="field">
        <span>Address</span>
        <textarea name="address" defaultValue={values.address} className="min-h-24" />
      </label>
      <label className="field">
        <span>Keep enquiries for (months)</span>
        <input name="enquiryRetentionMonths" defaultValue={String(values.enquiryRetentionMonths)} />
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
        {pending ? "Saving" : "Save company"}
      </button>
    </form>
  );
}
