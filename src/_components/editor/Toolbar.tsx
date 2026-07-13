"use client";

import { useCallback, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";
import ToolbarButton from "./ToolbarButton";
import ToolbarSeparator from "./ToolbarSeparator";
import ToolbarGroup from "./ToolbarGroup";

interface ToolbarProps {
  editor: Editor | null;
  onEmojiClick?: () => void;
}

const FONT_SIZES = [
  { label: "Small", value: "0.875rem" },
  { label: "Normal", value: "1rem" },
  { label: "Large", value: "1.25rem" },
  { label: "Huge", value: "1.5rem" },
];

const TEXT_COLORS = [
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#e11d48",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#0ea5e9",
  "#6366f1",
  "#a855f7",
  "#ec4899",
];

function DropdownWrapper({
  show,
  onClose,
  children,
}: {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 top-full z-50 mt-1">{children}</div>
    </>
  );
}

export default function Toolbar({ editor, onEmojiClick }: ToolbarProps) {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showAlignmentDropdown, setShowAlignmentDropdown] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback(
    (command: string, options?: Record<string, unknown>) => {
      if (!editor) return;
      const chain = editor.chain().focus();

      switch (command) {
        case "undo":
          chain.undo().run();
          break;
        case "redo":
          chain.redo().run();
          break;
        case "bold":
          chain.toggleBold().run();
          break;
        case "italic":
          chain.toggleItalic().run();
          break;
        case "underline":
          chain.toggleUnderline().run();
          break;
        case "strike":
          chain.toggleStrike().run();
          break;
        case "highlight":
          chain.toggleHighlight().run();
          break;
        case "code":
          chain.toggleCode().run();
          break;
        case "bulletList":
          chain.toggleBulletList().run();
          break;
        case "orderedList":
          chain.toggleOrderedList().run();
          break;
        case "taskList":
          chain.toggleTaskList().run();
          break;
        case "blockquote":
          chain.toggleBlockquote().run();
          break;
        case "codeBlock":
          chain.toggleCodeBlock().run();
          break;
        case "horizontalRule":
          chain.setHorizontalRule().run();
          break;
        case "paragraph":
          chain.setParagraph().run();
          break;
        case "heading":
          chain
            .toggleHeading({
              level: (options?.level as 1 | 2 | 3 | 4 | 5 | 6) ?? 2,
            })
            .run();
          break;
        case "fontSize":
          chain.setMark("textStyle", { fontSize: options?.size }).run();
          break;
        case "textColor":
          chain.setMark("textStyle", { color: options?.color }).run();
          break;
        case "alignLeft":
          chain.setTextAlign("left").run();
          break;
        case "alignCenter":
          chain.setTextAlign("center").run();
          break;
        case "alignRight":
          chain.setTextAlign("right").run();
          break;
        case "alignJustify":
          chain.setTextAlign("justify").run();
          break;
        case "insertTable":
          chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
          break;
        case "addColumnBefore":
          chain.addColumnBefore().run();
          break;
        case "addColumnAfter":
          chain.addColumnAfter().run();
          break;
        case "deleteColumn":
          chain.deleteColumn().run();
          break;
        case "addRowBefore":
          chain.addRowBefore().run();
          break;
        case "addRowAfter":
          chain.addRowAfter().run();
          break;
        case "deleteRow":
          chain.deleteRow().run();
          break;
        case "mergeCells":
          chain.mergeCells().run();
          break;
        case "splitCell":
          chain.splitCell().run();
          break;
        case "deleteTable":
          chain.deleteTable().run();
          break;
        case "setImage":
          chain.setImage({ src: options?.src as string }).run();
          break;
        case "setVideoEmbed":
          editor.commands.setVideoEmbed({ src: options?.src as string });
          break;
        case "setYouTubeVideo":
          chain.setYoutubeVideo({ src: options?.src as string }).run();
          break;
        case "setMath":
          editor.commands.setMath({
            formula: options?.formula as string,
            display: options?.display as boolean,
          });
          break;
        case "undoMath":
          chain.undo().run();
          break;
      }
    },
    [editor],
  );

  const setHeading = useCallback(
    (level: 1 | 2 | 3 | 4 | 5 | 6) => {
      exec("heading", { level });
      setShowHeadingDropdown(false);
    },
    [exec],
  );

  const setFontSize = useCallback(
    (size: string) => {
      exec("fontSize", { size });
      setShowFontSizeDropdown(false);
    },
    [exec],
  );

  const setAlignment = useCallback(
    (align: string) => {
      exec(align);
      setShowAlignmentDropdown(false);
    },
    [exec],
  );

  const handleImageInsert = useCallback(() => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const { uploadImage } = await import("./utils/uploadHandler");
      try {
        const url = await uploadImage(file);
        exec("setImage", { src: url });
      } catch (e) {
        console.error("Upload failed:", e);
      }
    };
    input.click();
  }, [editor, exec]);

  const handleYouTubeInsert = useCallback(() => {
    const url = prompt("Enter YouTube URL:");
    if (url) exec("setYouTubeVideo", { src: url });
  }, [exec]);

  const handleVideoInsert = useCallback(() => {
    const url = prompt("Enter video URL:");
    if (url) exec("setVideoEmbed", { src: url });
  }, [exec]);

  const handleMathInsert = useCallback(() => {
    const formula = prompt("Enter LaTeX formula:");
    if (formula) exec("setMath", { formula, display: false });
  }, [exec]);

  const handleLinkInsert = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = prompt("Enter URL:", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-slate-200 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800">
      <ToolbarGroup>
        <ToolbarButton title="Undo (Ctrl+Z)" onClick={() => exec("undo")}>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Redo (Ctrl+Y)" onClick={() => exec("redo")}>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <div className="relative">
          <ToolbarButton
            title="Heading"
            isActive={editor.isActive("heading")}
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h2v16H4V4zm14 0h2v16h-2V4zm-8 7V4h-2v7H6v2h2v7h2v-7h2V4h-2v7h-2z" />
            </svg>
          </ToolbarButton>
          <DropdownWrapper
            show={showHeadingDropdown}
            onClose={() => setShowHeadingDropdown(false)}
          >
            <div className="rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                onClick={() => exec("paragraph")}
              >
                Paragraph
              </button>
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <button
                  key={level}
                  type="button"
                  className="flex w-full items-center px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => setHeading(level as 1 | 2 | 3 | 4 | 5 | 6)}
                >
                  <span
                    className={`font-bold text-slate-800 dark:text-slate-200`}
                    style={{ fontSize: `${1.5 - level * 0.1}rem` }}
                  >
                    H{level}
                  </span>
                </button>
              ))}
            </div>
          </DropdownWrapper>
        </div>

        <div className="relative">
          <ToolbarButton
            title="Font Size"
            onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 7V4h16v3M9 20h6M12 4v16" />
            </svg>
          </ToolbarButton>
          <DropdownWrapper
            show={showFontSizeDropdown}
            onClose={() => setShowFontSizeDropdown(false)}
          >
            <div className="rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                  onClick={() => setFontSize(size.value)}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </DropdownWrapper>
        </div>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton
          title="Bold (Ctrl+B)"
          isActive={editor.isActive("bold")}
          onClick={() => exec("bold")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Italic (Ctrl+I)"
          isActive={editor.isActive("italic")}
          onClick={() => exec("italic")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Underline (Ctrl+U)"
          isActive={editor.isActive("underline")}
          onClick={() => exec("underline")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          isActive={editor.isActive("strike")}
          onClick={() => exec("strike")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Highlight"
          isActive={editor.isActive("highlight")}
          onClick={() => exec("highlight")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 14l3 3v5h6v-5l3-3V9H6v5zm2-3h8v2.17l-3 3V20h-2v-3.83l-3-3V11zm3-9h2v3h-2V2zM3.5 5.88l1.41-1.41 2.12 2.12L5.62 8 3.5 5.88zm13.46.71l2.12-2.12 1.41 1.41L18.38 8l-1.42-1.41z" />
          </svg>
        </ToolbarButton>
        <div className="relative">
          <ToolbarButton
            title="Text Color"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 2L5.5 16h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 9L12 4.67 14.38 11H9.62z" />
            </svg>
          </ToolbarButton>
          {showColorPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowColorPicker(false)}
              />
              <div
                ref={colorRef}
                className="absolute left-0 top-full z-50 mt-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="grid grid-cols-6 gap-1">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="h-6 w-6 rounded-full border border-slate-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        exec("textColor", { color });
                        setShowColorPicker(false);
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <div className="relative">
          <ToolbarButton
            title="Alignment"
            onClick={() => setShowAlignmentDropdown(!showAlignmentDropdown)}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
            </svg>
          </ToolbarButton>
          <DropdownWrapper
            show={showAlignmentDropdown}
            onClose={() => setShowAlignmentDropdown(false)}
          >
            <div className="rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
              {[
                {
                  cmd: "alignLeft",
                  label: "Left",
                  icon: "M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zM3 3v2h18V3H3z",
                },
                {
                  cmd: "alignCenter",
                  label: "Center",
                  icon: "M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z",
                },
                {
                  cmd: "alignRight",
                  label: "Right",
                  icon: "M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z",
                },
                {
                  cmd: "alignJustify",
                  label: "Justify",
                  icon: "M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zM3 3v2h18V3H3z",
                },
              ].map((item) => (
                <button
                  key={item.cmd}
                  type="button"
                  className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => setAlignment(item.cmd)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </DropdownWrapper>
        </div>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton
          title="Bullet List (Ctrl+Shift+7)"
          isActive={editor.isActive("bulletList")}
          onClick={() => exec("bulletList")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Ordered List (Ctrl+Shift+8)"
          isActive={editor.isActive("orderedList")}
          onClick={() => exec("orderedList")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Task List"
          isActive={editor.isActive("taskList")}
          onClick={() => exec("taskList")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton
          title="Blockquote"
          isActive={editor.isActive("blockquote")}
          onClick={() => exec("blockquote")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Code Block"
          isActive={editor.isActive("codeBlock")}
          onClick={() => exec("codeBlock")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Horizontal Rule"
          onClick={() => exec("horizontalRule")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 11h20v2H2z" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <div className="relative">
          <ToolbarButton
            title="Table"
            onClick={() => setShowTableMenu(!showTableMenu)}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z" />
            </svg>
          </ToolbarButton>
          {showTableMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowTableMenu(false)}
              />
              <div className="absolute left-0 top-full z-50 mt-1 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                {!editor.isActive("table") && (
                  <button
                    type="button"
                    className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                    onClick={() => {
                      exec("insertTable");
                      setShowTableMenu(false);
                    }}
                  >
                    Insert Table
                  </button>
                )}
                {editor.isActive("table") && (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                      onClick={() => {
                        exec("addColumnBefore");
                        setShowTableMenu(false);
                      }}
                    >
                      Add Column Before
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                      onClick={() => {
                        exec("addColumnAfter");
                        setShowTableMenu(false);
                      }}
                    >
                      Add Column After
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                      onClick={() => {
                        exec("deleteColumn");
                        setShowTableMenu(false);
                      }}
                    >
                      Delete Column
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                      onClick={() => {
                        exec("addRowBefore");
                        setShowTableMenu(false);
                      }}
                    >
                      Add Row Before
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                      onClick={() => {
                        exec("addRowAfter");
                        setShowTableMenu(false);
                      }}
                    >
                      Add Row After
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                      onClick={() => {
                        exec("deleteRow");
                        setShowTableMenu(false);
                      }}
                    >
                      Delete Row
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                      onClick={() => {
                        exec("mergeCells");
                        setShowTableMenu(false);
                      }}
                    >
                      Merge Cells
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-slate-50 hover:cursor-pointer hover:text-shadow-2xs"
                      onClick={() => {
                        exec("splitCell");
                        setShowTableMenu(false);
                      }}
                    >
                      Split Cell
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-left text-sm text-rose-600 hover:bg-rose-50 hover:cursor-pointer hover:text-shadow-2xs"
                      onClick={() => {
                        exec("deleteTable");
                        setShowTableMenu(false);
                      }}
                    >
                      Delete Table
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <ToolbarButton
          title="Link (Ctrl+K)"
          isActive={editor.isActive("link")}
          onClick={handleLinkInsert}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton title="Image" onClick={handleImageInsert}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Video" onClick={handleVideoInsert}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="YouTube" onClick={handleYouTubeInsert}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Emoji" onClick={() => onEmojiClick?.()}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Math" onClick={handleMathInsert}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.05 14.43l-2.34-2.34L10.6 17l-3.54-3.54 1.41-1.41 2.13 2.13 3.34-3.34 1.41 1.41-4.75 4.75zM14.97 6H9.03v2h5.94V6z" />
          </svg>
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  );
}
