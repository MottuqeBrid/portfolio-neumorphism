export interface ToolbarButtonConfig {
  name: string;
  label: string;
  icon: string;
  shortcut?: string;
  action?: string;
  type: "button" | "dropdown" | "group" | "separator";
  isActive?: (editor: Record<string, unknown>) => boolean;
  children?: ToolbarButtonConfig[];
}

export const TOOLBAR_BUTTONS: ToolbarButtonConfig[] = [
  {
    name: "undo",
    label: "Undo",
    icon: "undo",
    shortcut: "Ctrl+Z",
    type: "button",
  },
  {
    name: "redo",
    label: "Redo",
    icon: "redo",
    shortcut: "Ctrl+Y",
    type: "button",
  },
  {
    name: "separator1",
    label: "",
    icon: "",
    type: "separator",
  },
  {
    name: "heading",
    label: "Heading",
    icon: "heading",
    type: "dropdown",
    children: [
      { name: "heading1", label: "H1", icon: "h1", type: "button" },
      { name: "heading2", label: "H2", icon: "h2", type: "button" },
      { name: "heading3", label: "H3", icon: "h3", type: "button" },
      { name: "heading4", label: "H4", icon: "h4", type: "button" },
      { name: "heading5", label: "H5", icon: "h5", type: "button" },
      { name: "heading6", label: "H6", icon: "h6", type: "button" },
      { name: "paragraph", label: "Paragraph", icon: "paragraph", type: "button" },
    ],
  },
  {
    name: "fontSize",
    label: "Font Size",
    icon: "type",
    type: "dropdown",
    children: [
      { name: "fontSizeSmall", label: "Small", icon: "", type: "button" },
      { name: "fontSizeNormal", label: "Normal", icon: "", type: "button" },
      { name: "fontSizeLarge", label: "Large", icon: "", type: "button" },
      { name: "fontSizeHuge", label: "Huge", icon: "", type: "button" },
    ],
  },
  {
    name: "separator2",
    label: "",
    icon: "",
    type: "separator",
  },
  {
    name: "bold",
    label: "Bold",
    icon: "bold",
    shortcut: "Ctrl+B",
    type: "button",
  },
  {
    name: "italic",
    label: "Italic",
    icon: "italic",
    shortcut: "Ctrl+I",
    type: "button",
  },
  {
    name: "underline",
    label: "Underline",
    icon: "underline",
    shortcut: "Ctrl+U",
    type: "button",
  },
  {
    name: "strike",
    label: "Strikethrough",
    icon: "strikethrough",
    shortcut: "Ctrl+Shift+X",
    type: "button",
  },
  {
    name: "highlight",
    label: "Highlight",
    icon: "highlight",
    type: "button",
  },
  {
    name: "textColor",
    label: "Text Color",
    icon: "palette",
    type: "button",
  },
  {
    name: "separator3",
    label: "",
    icon: "",
    type: "separator",
  },
  {
    name: "alignment",
    label: "Alignment",
    icon: "align-left",
    type: "dropdown",
    children: [
      { name: "alignLeft", label: "Left", icon: "align-left", type: "button" },
      { name: "alignCenter", label: "Center", icon: "align-center", type: "button" },
      { name: "alignRight", label: "Right", icon: "align-right", type: "button" },
      { name: "alignJustify", label: "Justify", icon: "align-justify", type: "button" },
    ],
  },
  {
    name: "separator4",
    label: "",
    icon: "",
    type: "separator",
  },
  {
    name: "bulletList",
    label: "Bullet List",
    icon: "list-ul",
    shortcut: "Ctrl+Shift+7",
    type: "button",
  },
  {
    name: "orderedList",
    label: "Ordered List",
    icon: "list-ol",
    shortcut: "Ctrl+Shift+8",
    type: "button",
  },
  {
    name: "taskList",
    label: "Task List",
    icon: "list-check",
    type: "button",
  },
  {
    name: "separator5",
    label: "",
    icon: "",
    type: "separator",
  },
  {
    name: "blockquote",
    label: "Blockquote",
    icon: "quote-left",
    type: "button",
  },
  {
    name: "codeBlock",
    label: "Code Block",
    icon: "code",
    type: "button",
  },
  {
    name: "horizontalRule",
    label: "Horizontal Rule",
    icon: "minus",
    type: "button",
  },
  {
    name: "separator6",
    label: "",
    icon: "",
    type: "separator",
  },
  {
    name: "table",
    label: "Table",
    icon: "table",
    type: "group",
    children: [
      { name: "insertTable", label: "Insert Table", icon: "table", type: "button" },
      { name: "addColumnBefore", label: "Add Column Before", icon: "", type: "button" },
      { name: "addColumnAfter", label: "Add Column After", icon: "", type: "button" },
      { name: "deleteColumn", label: "Delete Column", icon: "", type: "button" },
      { name: "addRowBefore", label: "Add Row Before", icon: "", type: "button" },
      { name: "addRowAfter", label: "Add Row After", icon: "", type: "button" },
      { name: "deleteRow", label: "Delete Row", icon: "", type: "button" },
      { name: "mergeCells", label: "Merge Cells", icon: "", type: "button" },
      { name: "splitCell", label: "Split Cell", icon: "", type: "button" },
      { name: "deleteTable", label: "Delete Table", icon: "", type: "button" },
    ],
  },
  {
    name: "link",
    label: "Link",
    icon: "link",
    shortcut: "Ctrl+K",
    type: "button",
  },
  {
    name: "separator7",
    label: "",
    icon: "",
    type: "separator",
  },
  {
    name: "image",
    label: "Image",
    icon: "image",
    type: "button",
  },
  {
    name: "video",
    label: "Video",
    icon: "video",
    type: "button",
  },
  {
    name: "youtube",
    label: "YouTube",
    icon: "youtube",
    type: "button",
  },
  {
    name: "emoji",
    label: "Emoji",
    icon: "smile",
    type: "button",
  },
  {
    name: "math",
    label: "Math",
    icon: "square-root",
    type: "button",
  },
];
