"use client";

import type { SyntheticEvent } from "react";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ImageUpload from "./ImageUpload";
import {
  emptyProjectForm,
  toProjectPayload,
  type ProjectFormValues,
  type ProjectInstance,
} from "./types";

const inputClass =
  "nm-dent w-full rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]";

const labelClass = "text-sm font-bold text-slate-700";

type ProjectFormProps = {
  onCreated: (project: ProjectInstance) => void;
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export default function ProjectForm({ onCreated }: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>(emptyProjectForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = <Key extends keyof ProjectFormValues>(
    key: Key,
    value: ProjectFormValues[Key],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!values.title.trim()) {
      setError("Project title is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toProjectPayload(values)),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Unable to create project. Please try again.");
        return;
      }

      setSuccess("Project created successfully.");
      setValues(emptyProjectForm);
      if (data?.project) {
        onCreated(data.project as ProjectInstance);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="nm-protrude flex flex-col gap-5 rounded-3xl p-6 sm:p-7"
    >
      <div>
        <h2 className="text-xl font-black tracking-tight text-slate-800">
          Add a project
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Fill in the details below to publish a new project.
        </p>
      </div>

      <Field label="Title">
        <input
          type="text"
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Portfolio Neumorphism"
          className={inputClass}
          required
        />
      </Field>

      <Field label="Short description">
        <input
          type="text"
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="A short one-line summary"
          className={inputClass}
        />
      </Field>

      <Field label="Long description">
        <textarea
          value={values.longDescription}
          onChange={(event) => update("longDescription", event.target.value)}
          placeholder="Detailed description of the project..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </Field>

      <ImageUpload
        label="Thumbnail"
        hint="Main image shown in listings"
        value={values.thumbnail ? [values.thumbnail] : []}
        onChange={(urls) => update("thumbnail", urls[urls.length - 1] ?? "")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tech stack" hint="Separate with commas or new lines">
          <textarea
            value={values.techStack}
            onChange={(event) => update("techStack", event.target.value)}
            placeholder="React, Next.js, Tailwind CSS"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>
        <Field label="Key features" hint="Separate with commas or new lines">
          <textarea
            value={values.keyFeatures}
            onChange={(event) => update("keyFeatures", event.target.value)}
            placeholder="Responsive design, Dark mode"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      <ImageUpload
        label="Gallery images"
        hint="Upload one or more screenshots"
        value={values.images}
        onChange={(urls) => update("images", urls)}
        multiple
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Live URL">
          <input
            type="url"
            value={values.live}
            onChange={(event) => update("live", event.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
        <Field label="Source URL">
          <input
            type="url"
            value={values.source}
            onChange={(event) => update("source", event.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
        <Field label="GitHub (client)">
          <input
            type="url"
            value={values.githubClient}
            onChange={(event) => update("githubClient", event.target.value)}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </Field>
        <Field label="GitHub (server)">
          <input
            type="url"
            value={values.githubServer}
            onChange={(event) => update("githubServer", event.target.value)}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="nm-dent flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3">
          <input
            type="checkbox"
            checked={values.isCompleted}
            onChange={(event) => update("isCompleted", event.target.checked)}
            className="h-4 w-4 accent-sky-600"
          />
          <span className="text-sm font-bold text-slate-700">Completed</span>
        </label>
        <label className="nm-dent flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3">
          <input
            type="checkbox"
            checked={values.showInUI}
            onChange={(event) => update("showInUI", event.target.checked)}
            className="h-4 w-4 accent-sky-600"
          />
          <span className="text-sm font-bold text-slate-700">
            Show on site
          </span>
        </label>
      </div>

      {error ? (
        <p
          role="alert"
          className="nm-dent rounded-xl px-4 py-3 text-sm font-semibold text-rose-600"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          role="status"
          className="nm-dent rounded-xl px-4 py-3 text-sm font-semibold text-emerald-600"
        >
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="nm-protrude inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-sky-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:nm-protrude"
      >
        <FiPlus className="text-lg" aria-hidden="true" />
        <span>{isSubmitting ? "Adding..." : "Add project"}</span>
      </button>
    </form>
  );
}
