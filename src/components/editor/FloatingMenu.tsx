"use client";

import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/core";
import { FloatingMenu as TiptapFloatingMenu } from "@tiptap/react/menus";

interface EditorFloatingMenuProps {
  editor: Editor;
}

interface MenuItem {
  label: string;
  icon: string;
  action: () => void;
}

export default function EditorFloatingMenu({ editor }: EditorFloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const createMenuItems = useCallback((): MenuItem[] => {
    return [
      {
        label: "Heading 1",
        icon: "H1",
        action: () => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setIsOpen(false); },
      },
      {
        label: "Heading 2",
        icon: "H2",
        action: () => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setIsOpen(false); },
      },
      {
        label: "Heading 3",
        icon: "H3",
        action: () => { editor.chain().focus().toggleHeading({ level: 3 }).run(); setIsOpen(false); },
      },
      {
        label: "Bullet List",
        icon: "• —",
        action: () => { editor.chain().focus().toggleBulletList().run(); setIsOpen(false); },
      },
      {
        label: "Ordered List",
        icon: "1.",
        action: () => { editor.chain().focus().toggleOrderedList().run(); setIsOpen(false); },
      },
      {
        label: "Task List",
        icon: "✓",
        action: () => { editor.chain().focus().toggleTaskList().run(); setIsOpen(false); },
      },
      {
        label: "Blockquote",
        icon: "\"",
        action: () => { editor.chain().focus().toggleBlockquote().run(); setIsOpen(false); },
      },
      {
        label: "Code Block",
        icon: "</>",
        action: () => { editor.chain().focus().toggleCodeBlock().run(); setIsOpen(false); },
      },
      {
        label: "Callout",
        icon: "💡",
        action: () => { (editor as unknown as { commands: { setCallout: (opts: { variant: string }) => void } }).commands.setCallout({ variant: "info" }); setIsOpen(false); },
      },
      {
        label: "Table",
        icon: "▦",
        action: () => { editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); setIsOpen(false); },
      },
    ];
  }, [editor]);

  return (
    <TiptapFloatingMenu
      editor={editor}
    >
      <div className="relative">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
          onClick={() => setIsOpen(!isOpen)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute left-full top-0 z-50 ml-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              {createMenuItems().map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={item.action}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </TiptapFloatingMenu>
  );
}
