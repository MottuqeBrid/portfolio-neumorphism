import { useCallback, useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useSaveStatus(editor: Editor | null) {
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (mountedRef.current) setIsDirty(true);
    };

    const handleTransaction = () => {
      if (mountedRef.current) setIsDirty(true);
    };

    editor.on("update", handleUpdate);
    editor.on("transaction", handleTransaction);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("transaction", handleTransaction);
    };
  }, [editor]);

  const markSaved = useCallback(() => {
    if (mountedRef.current) {
      setIsDirty(false);
      setLastSaved(new Date());
      setStatus("saved");
      setTimeout(() => {
        if (mountedRef.current) setStatus("idle");
      }, 2000);
    }
  }, []);

  const markSaving = useCallback(() => {
    if (mountedRef.current) setStatus("saving");
  }, []);

  const markError = useCallback(() => {
    if (mountedRef.current) setStatus("error");
  }, []);

  return {
    isDirty,
    lastSaved,
    status,
    markSaved,
    markSaving,
    markError,
  };
}
