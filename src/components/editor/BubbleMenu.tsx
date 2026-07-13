"use client";

import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/core";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";

interface EditorBubbleMenuProps {
  editor: Editor;
}

const TEXT_COLORS = [
  "#000000", "#e11d48", "#f97316", "#eab308",
  "#22c55e", "#0ea5e9", "#6366f1", "#a855f7",
];

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const exec = useCallback(
    (command: string, options?: Record<string, unknown>) => {
      const chain = editor.chain().focus();
      switch (command) {
        case "bold": chain.toggleBold().run(); break;
        case "italic": chain.toggleItalic().run(); break;
        case "underline": chain.toggleUnderline().run(); break;
        case "strike": chain.toggleStrike().run(); break;
        case "code": chain.toggleCode().run(); break;
        case "highlight": chain.toggleHighlight().run(); break;
        case "textColor":
          chain.setMark("textStyle", { color: options?.color }).run();
          setShowColorPicker(false);
          break;
        case "setLink": {
          const url = prompt("Enter URL:", "https://");
          if (url) chain.setLink({ href: url, target: "_blank" }).run();
          break;
        }
        case "unsetLink":
          chain.unsetLink().run();
          break;
      }
    },
    [editor],
  );

  return (
    <TiptapBubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      <button type="button" className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors ${editor.isActive("bold") ? "bg-sky-100 text-sky-700" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => exec("bold")} onMouseDown={(e) => e.preventDefault()}>B</button>
      <button type="button" className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs italic transition-colors ${editor.isActive("italic") ? "bg-sky-100 text-sky-700" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => exec("italic")} onMouseDown={(e) => e.preventDefault()}>I</button>
      <button type="button" className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs underline transition-colors ${editor.isActive("underline") ? "bg-sky-100 text-sky-700" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => exec("underline")} onMouseDown={(e) => e.preventDefault()}>U</button>
      <button type="button" className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs line-through transition-colors ${editor.isActive("strike") ? "bg-sky-100 text-sky-700" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => exec("strike")} onMouseDown={(e) => e.preventDefault()}>S</button>
      <button type="button" className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-colors ${editor.isActive("code") ? "bg-sky-100 text-sky-700" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => exec("code")} onMouseDown={(e) => e.preventDefault()}>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>
      </button>
      <button type="button" className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-colors ${editor.isActive("highlight") ? "bg-sky-100 text-sky-700" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => exec("highlight")} onMouseDown={(e) => e.preventDefault()}>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 14l3 3v5h6v-5l3-3V9H6v5zm2-3h8v2.17l-3 3V20h-2v-3.83l-3-3V11zm3-9h2v3h-2V2zM3.5 5.88l1.41-1.41 2.12 2.12L5.62 8 3.5 5.88zm13.46.71l2.12-2.12 1.41 1.41L18.38 8l-1.42-1.41z" /></svg>
      </button>

      <div className="mx-0.5 h-5 w-px bg-slate-200 dark:bg-slate-700" />

      <div className="relative">
        <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400" onClick={() => setShowColorPicker(!showColorPicker)} onMouseDown={(e) => e.preventDefault()}>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2L5.5 16h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 9L12 4.67 14.38 11H9.62z" /></svg>
        </button>
        {showColorPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
            <div className="absolute left-0 top-full z-50 mt-1 flex gap-1 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              {TEXT_COLORS.map((color) => (
                <button key={color} type="button" className="h-5 w-5 rounded-full border border-slate-200 hover:scale-110 transition-transform" style={{ backgroundColor: color }} onClick={() => exec("textColor", { color })} onMouseDown={(e) => e.preventDefault()} />
              ))}
            </div>
          </>
        )}
      </div>

      <button type="button" className={`inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs transition-colors ${editor.isActive("link") ? "bg-sky-100 text-sky-700" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"}`} onClick={() => editor.isActive("link") ? exec("unsetLink") : exec("setLink")} onMouseDown={(e) => e.preventDefault()}>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" /></svg>
        Link
      </button>
    </TiptapBubbleMenu>
  );
}
