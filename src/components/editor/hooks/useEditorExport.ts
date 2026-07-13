import { useCallback } from "react";
import type { Editor, JSONContent } from "@tiptap/core";
import { tiptapToHtml } from "../utils/tiptapToHtml";
import { tiptapToMarkdown } from "../utils/markdownConverters";

export function useEditorExport(editor: Editor | null) {
  const exportHTML = useCallback(() => {
    if (!editor) return "";
    return editor.getHTML();
  }, [editor]);

  const exportJSON = useCallback(() => {
    if (!editor) return null;
    return editor.getJSON();
  }, [editor]);

  const exportJSONString = useCallback(() => {
    if (!editor) return "";
    return JSON.stringify(editor.getJSON());
  }, [editor]);

  const exportMarkdown = useCallback(() => {
    if (!editor) return "";
    const json = editor.getJSON();
    return tiptapToMarkdown(json);
  }, [editor]);

  const downloadFile = useCallback(
    (content: string, filename: string, mimeType: string) => {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    [],
  );

  const downloadHTML = useCallback(
    (filename: string) => {
      const html = exportHTML();
      downloadFile(html, filename, "text/html");
    },
    [exportHTML, downloadFile],
  );

  const downloadJSON = useCallback(
    (filename: string) => {
      const json = exportJSONString();
      downloadFile(json, filename, "application/json");
    },
    [exportJSONString, downloadFile],
  );

  const downloadMarkdown = useCallback(
    (filename: string) => {
      const md = exportMarkdown();
      downloadFile(md, filename, "text/markdown");
    },
    [exportMarkdown, downloadFile],
  );

  const copyHTML = useCallback(async () => {
    const html = exportHTML();
    await navigator.clipboard.writeText(html);
  }, [exportHTML]);

  const copyMarkdown = useCallback(async () => {
    const md = exportMarkdown();
    await navigator.clipboard.writeText(md);
  }, [exportMarkdown]);

  return {
    exportHTML,
    exportJSON,
    exportJSONString,
    exportMarkdown,
    downloadHTML,
    downloadJSON,
    downloadMarkdown,
    copyHTML,
    copyMarkdown,
  };
}

export { tiptapToHtml, tiptapToMarkdown };
export type { JSONContent };
