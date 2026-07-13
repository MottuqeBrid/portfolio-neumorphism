"use client";

import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/core";

interface LinkMenuProps {
  editor: Editor;
  onClose: () => void;
}

export default function LinkMenu({ editor, onClose }: LinkMenuProps) {
  const existingHref = editor.getAttributes("link").href as string | undefined;
  const [url, setUrl] = useState(existingHref ?? "");
  const [openInNewTab, setOpenInNewTab] = useState(true);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim()) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({
            href: url.trim(),
            target: openInNewTab ? "_blank" : undefined,
          })
          .run();
      }
      onClose();
    },
    [editor, url, openInNewTab, onClose],
  );

  const handleRemoveLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onClose();
  }, [editor, onClose]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-80 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-sky-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
        autoFocus
      />

      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <input
          type="checkbox"
          checked={openInNewTab}
          onChange={(e) => setOpenInNewTab(e.target.checked)}
          className="rounded"
        />
        Open in new tab
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-600"
        >
          {url.trim() ? "Set Link" : "Remove Link"}
        </button>
        {existingHref && (
          <button
            type="button"
            onClick={handleRemoveLink}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400"
          >
            Remove
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
