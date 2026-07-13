"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, createElement } from "react";
import { createRoot } from "react-dom/client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Typography from "@tiptap/extension-typography";
import { Placeholder } from "@tiptap/extensions/placeholder";
import { common, createLowlight } from "lowlight";
import { Suggestion } from "@tiptap/suggestion";

import {
  ImageUpload,
  Callout,
  ToggleList,
  VideoEmbed,
  Mathematics,
  Mention,
  Hashtag,
} from "./extensions";
import Toolbar from "./Toolbar";
import EditorBubbleMenu from "./BubbleMenu";
import EditorFloatingMenu from "./FloatingMenu";
import SlashCommandMenu from "./menus/SlashCommandMenu";
import EmojiPicker from "./menus/EmojiPicker";

const lowlight = createLowlight(common);

export interface TiptapEditorHandle {
  getJSON: () => ReturnType<import("@tiptap/core").Editor["getJSON"]>;
  getHTML: () => string;
  getContent: () => { json: ReturnType<import("@tiptap/core").Editor["getJSON"]>; html: string };
  setContent: (content: string | object) => void;
  clearContent: () => void;
  focus: () => void;
}

interface TiptapEditorProps {
  content?: string;
  editable?: boolean;
  onUpdate?: (json: ReturnType<import("@tiptap/core").Editor["getJSON"]>, html: string) => void;
  onSave?: (json: ReturnType<import("@tiptap/core").Editor["getJSON"]>, html: string) => void;
  placeholder?: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SLASH_COMMANDS: { title: string; description: string; icon: string; category: string; command: (args: { editor: any; range: any }) => void }[] = [
  { title: "Paragraph", description: "Plain text block", icon: "¶", category: "Text", command: ({ editor }) => editor.chain().focus().setParagraph().run() },
  { title: "Heading 1", description: "Large section heading", icon: "H1", category: "Text", command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { title: "Heading 2", description: "Medium section heading", icon: "H2", category: "Text", command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { title: "Heading 3", description: "Small section heading", icon: "H3", category: "Text", command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  { title: "Bullet List", description: "Create a bullet list", icon: "•", category: "Lists", command: ({ editor }) => editor.chain().focus().toggleBulletList().run() },
  { title: "Ordered List", description: "Create an ordered list", icon: "1.", category: "Lists", command: ({ editor }) => editor.chain().focus().toggleOrderedList().run() },
  { title: "Task List", description: "Create a task list", icon: "✓", category: "Lists", command: ({ editor }) => editor.chain().focus().toggleTaskList().run() },
  { title: "Blockquote", description: "Create a blockquote", icon: "\"", category: "Blocks", command: ({ editor }) => editor.chain().focus().toggleBlockquote().run() },
  { title: "Code Block", description: "Create a code block", icon: "</>", category: "Blocks", command: ({ editor }) => editor.chain().focus().toggleCodeBlock().run() },
  { title: "Callout", description: "Add a callout box", icon: "💡", category: "Blocks", command: ({ editor }) => { editor.commands.setCallout({ variant: "info" }); return true; } },
  { title: "Table", description: "Insert a table", icon: "▦", category: "Blocks", command: ({ editor }) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { title: "Horizontal Rule", description: "Add a horizontal line", icon: "—", category: "Blocks", command: ({ editor }) => editor.chain().focus().setHorizontalRule().run() },
  { title: "Image", description: "Upload or embed an image", icon: "🖼", category: "Media", command: ({ editor }) => { editor.chain().focus().setImageUpload().run(); } },
  { title: "Video", description: "Embed a video", icon: "🎬", category: "Media", command: () => { /* open video dialog */ } },
  { title: "YouTube", description: "Embed a YouTube video", icon: "▶", category: "Media", command: () => { /* open youtube dialog */ } },
];

const TiptapEditor = forwardRef<TiptapEditorHandle, TiptapEditorProps>(
  function TiptapEditor(
    { content, editable = true, onUpdate, placeholder = "Start writing your note...", className },
    ref,
  ) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const initialContent = useMemo(() => {
      if (!content) return undefined;
      try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === "object" && "type" in parsed) return parsed;
        if (parsed && typeof parsed === "object" && "content" in parsed) return parsed;
        return undefined;
      } catch {
        return content;
      }
    }, [content]);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3, 4, 5, 6] },
          codeBlock: false,
        }),
        Underline,
        Highlight.configure({ multicolor: true }),
        TextStyle,
        Color,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        FontFamily,
        TaskList,
        TaskItem.configure({ nested: true }),
        Table.configure({ resizable: true }),
        TableRow,
        TableCell,
        TableHeader,
        Image.configure({ inline: false, allowBase64: false }),
        Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
        Youtube.configure({ width: 640, height: 360 }),
        CodeBlockLowlight.configure({ lowlight }),
        Typography,
        Placeholder.configure({ placeholder }),
        ImageUpload,
        Callout,
        ToggleList,
        VideoEmbed,
        Mathematics,
        Mention,
        Hashtag,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Suggestion as any,
        {
          char: "/",
          items: ({ query }: { query: string }) => {
            return SLASH_COMMANDS.filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase()),
            );
          },
          render: () => {
            let component: ReturnType<typeof import("react-dom/client").createRoot> | null = null;
            let popup: HTMLDivElement | null = null;

            return {
              onStart: (props: Record<string, unknown>) => {
                popup = document.createElement("div");
                popup.className = "slash-command-popup";
                popup.style.position = "fixed";
                popup.style.zIndex = "1000";
                document.body.appendChild(popup);

                const root = createRoot(popup);
                component = root;
                component.render(
                  createElement(SlashCommandMenu as unknown as React.ComponentType<Record<string, unknown>>, {
                    items: (props.items ?? []) as unknown[],
                    command: (item: unknown) => {
                      (props.command as (item: unknown) => void)(item);
                    },
                  }),
                );
              },
              onUpdate: (props: Record<string, unknown>) => {
                if (!component || !popup) return;
                component.render(
                  createElement(SlashCommandMenu as unknown as React.ComponentType<Record<string, unknown>>, {
                    items: (props.items ?? []) as unknown[],
                    command: (item: unknown) => {
                      (props.command as (item: unknown) => void)(item);
                    },
                  }),
                );
              },
              onKeyDown: (props: { event: KeyboardEvent }) => {
                if (props.event.key === "Escape") {
                  if (popup) popup.style.display = "none";
                  return true;
                }
                return false;
              },
              onExit: () => {
                if (component) component.unmount();
                if (popup) popup.remove();
              },
            };
          },
        },
      ],
      content: initialContent,
      editable,
      onUpdate: ({ editor: ed }) => {
        const json = ed.getJSON();
        const html = ed.getHTML();
        onUpdate?.(json, html);
      },
      editorProps: {
        attributes: {
          class: "prose-editor-content focus:outline-none min-h-[200px] px-4 py-3",
        },
        handlePaste: (_view, event) => {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (const item of Array.from(items)) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file && editor) {
                import("./utils/uploadHandler").then(({ uploadImage }) => {
                  uploadImage(file).then((url) => {
                    editor.chain().focus().setImage({ src: url }).run();
                  });
                });
              }
              return true;
            }
          }
          return false;
        },
      },
    });

    useImperativeHandle(ref, () => ({
      getJSON: () => editor?.getJSON() ?? { type: "doc", content: [] },
      getHTML: () => editor?.getHTML() ?? "",
      getContent: () => ({
        json: editor?.getJSON() ?? { type: "doc", content: [] },
        html: editor?.getHTML() ?? "",
      }),
      setContent: (c) => editor?.commands.setContent(c),
      clearContent: () => editor?.commands.clearContent(),
      focus: () => editor?.commands.focus(),
    }));

    useEffect(() => {
      if (editor) {
        if (typeof window !== "undefined") {
          (window as unknown as Record<string, unknown>).__tiptapEditor = editor;
        }
      };
      return () => {
        if (typeof window !== "undefined") {
          delete (window as unknown as Record<string, unknown>).__tiptapEditor;
        }
      };
    }, [editor]);

    const handleEmojiSelect = useCallback(
      (emoji: string) => {
        if (editor) {
          editor.chain().focus().insertContent(emoji).run();
        }
        setShowEmojiPicker(false);
      },
      [editor],
    );

    if (!editor) return null;

    return (
      <div ref={containerRef} className={`relative flex flex-col ${className ?? ""}`}>
        {editable && (
          <div className="sticky top-0 z-30">
            <Toolbar editor={editor} onEmojiClick={() => setShowEmojiPicker(!showEmojiPicker)} />
          </div>
        )}

        <div className="relative flex-1 overflow-y-auto">
          {editable && <EditorFloatingMenu editor={editor} />}
          {editable && <EditorBubbleMenu editor={editor} />}
          <EditorContent editor={editor} className="prose-editor-content" />

          {showEmojiPicker && (
            <div className="absolute bottom-full left-4 z-50 mb-2">
              <EmojiPicker onSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default TiptapEditor;
