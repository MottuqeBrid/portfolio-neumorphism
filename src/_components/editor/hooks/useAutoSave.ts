import { useCallback, useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutoSave(
  editor: Editor | null,
  options: {
    onSave: (json: ReturnType<Editor["getJSON"]>, html: string) => Promise<void>;
    delay?: number;
    enabled?: boolean;
  },
) {
  const { onSave, delay = 2000, enabled = true } = options;
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const performSave = useCallback(async () => {
    if (!editor || !enabled) return;
    try {
      setSaveStatus("saving");
      const json = editor.getJSON();
      const html = editor.getHTML();
      await onSave(json, html);
      if (mountedRef.current) {
        setSaveStatus("saved");
        setLastSaved(new Date());
        setTimeout(() => {
          if (mountedRef.current) setSaveStatus("idle");
        }, 2000);
      }
    } catch {
      if (mountedRef.current) setSaveStatus("error");
    }
  }, [editor, onSave, enabled]);

  useEffect(() => {
    if (!editor || !enabled) return;

    const handleUpdate = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        void performSave();
      }, delay);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [editor, delay, enabled, performSave]);

  const triggerSave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    void performSave();
  }, [performSave]);

  return {
    saveStatus,
    lastSaved,
    triggerSave,
  };
}
