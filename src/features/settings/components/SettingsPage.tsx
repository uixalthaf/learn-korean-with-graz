"use client";

import { useState, type ChangeEventHandler, type FormEvent } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  function markChanged() {
    setSaved(false);
  }

  return (
    <form onSubmit={saveProfile} className="mx-auto max-w-[1120px] space-y-6 pb-6 text-foreground">
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-heading sm:text-2xl">Profile</h2>
          <p className="mt-1 text-sm text-muted sm:text-base">
            This is how your students see you across the platform.
          </p>
        </div>

        <div className="mb-7 mt-6 flex flex-wrap items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-accent-background text-3xl font-semibold text-primary">
            T
          </div>
          <div>
            <label className="inline-flex cursor-pointer rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-primary hover:bg-surface">
              Change photo
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={markChanged}
              />
            </label>
            <p className="mt-2 text-sm text-muted">JPG or PNG, up to 2 MB</p>
          </div>
        </div>

        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="Full name" defaultValue="Grazia" onChange={markChanged} />
          <Field label="Display name" defaultValue="Tutor Grazia" onChange={markChanged} />
          <Field label="Email" type="email" placeholder="name@example.com" onChange={markChanged} />
          <Field label="Phone" type="tel" placeholder="+00 00000 00000" onChange={markChanged} />
          <label className="block space-y-2 text-sm font-medium text-foreground">
            <span>Time zone</span>
            <select
              defaultValue="Asia/Kolkata"
              onChange={markChanged}
              className={`${controlClass} cursor-pointer`}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (UTC+05:30)</option>
              <option value="Asia/Seoul">Asia/Seoul (UTC+09:00)</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            <span>Teaching language</span>
            <select
              defaultValue="ko"
              onChange={markChanged}
              className={`${controlClass} cursor-pointer`}
            >
              <option value="ko">Korean (한국어)</option>
              <option value="en">English</option>
            </select>
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground sm:col-span-2">
            <span>Bio</span>
            <textarea
              rows={4}
              placeholder="Tell your students a little about yourself and how you teach."
              onChange={markChanged}
              className={`${controlClass} h-auto resize-y py-3`}
            />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {saved && (
          <p role="status" className="mr-auto text-sm text-muted">
            Saved for this preview.
          </p>
        )}
        <button
          type="reset"
          onClick={() => setSaved(false)}
          className="cursor-pointer rounded-xl border border-border bg-card px-5 py-3 font-semibold text-foreground hover:bg-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="cursor-pointer rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:opacity-90"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

const controlClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-base font-normal text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function Field({
  label,
  type = "text",
  placeholder,
  defaultValue,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium text-foreground">
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        className={controlClass}
      />
    </label>
  );
}
