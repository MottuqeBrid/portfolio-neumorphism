import { mergeAttributes, Node, type CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/react";
import { useState, useCallback } from "react";

const CALLOUT_VARIANTS = {
  info: { icon: "💡", label: "Info" },
  warning: { icon: "⚠️", label: "Warning" },
  error: { icon: "🚫", label: "Error" },
  success: { icon: "✅", label: "Success" },
} as const;

type Variant = keyof typeof CALLOUT_VARIANTS;

function CalloutComponent(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props;
  const variant = (node.attrs.variant as Variant) || "info";
  const icon = (node.attrs.icon as string) || CALLOUT_VARIANTS[variant].icon;
  const [showPicker, setShowPicker] = useState(false);

  const setVariant = useCallback(
    (v: Variant) => {
      updateAttributes({ variant: v, icon: CALLOUT_VARIANTS[v].icon });
      setShowPicker(false);
    },
    [updateAttributes],
  );

  return (
    <NodeViewWrapper data-drag-handle>
      <div
        className={`callout callout-${variant} relative my-2 flex gap-3 rounded-xl border p-4 ${
          selected ? "ring-2 ring-sky-400" : ""
        } ${
          variant === "info"
            ? "border-blue-200 bg-blue-50"
            : variant === "warning"
              ? "border-amber-200 bg-amber-50"
              : variant === "error"
                ? "border-rose-200 bg-rose-50"
                : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <button
          type="button"
          contentEditable={false}
          className="shrink-0 text-lg hover:opacity-70"
          onClick={() => setShowPicker(!showPicker)}
          title="Change callout type"
        >
          {icon}
        </button>

        {showPicker && (
          <div
            contentEditable={false}
            className="absolute left-0 top-full z-10 mt-1 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
          >
            {(Object.keys(CALLOUT_VARIANTS) as Variant[]).map((v) => (
              <button
                key={v}
                type="button"
                className={`rounded-md px-2 py-1 text-sm hover:bg-slate-100 ${variant === v ? "bg-sky-50 text-sky-700" : ""}`}
                onClick={() => setVariant(v)}
              >
                {CALLOUT_VARIANTS[v].icon} {CALLOUT_VARIANTS[v].label}
              </button>
            ))}
          </div>
        )}

        <div className="callout-content min-w-0 flex-1">
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const Callout = Node.create({
  name: "callout",

  group: "block",

  content: "block+",

  defining: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      variant: { default: "info" },
      icon: { default: "💡" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            variant: element.getAttribute("data-variant") || "info",
            icon: element.getAttribute("data-icon") || "💡",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "callout",
        class: `callout callout-${HTMLAttributes.variant ?? "info"}`,
      }),
      0,
    ];
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCommands(): any {
    return {
      setCallout:
        (options?: { variant?: Variant; icon?: string }) =>
        ({ commands }: CommandProps) => {
          return commands.wrapIn(this.name, {
            variant: options?.variant ?? "info",
            icon: options?.icon ?? CALLOUT_VARIANTS[options?.variant ?? "info"].icon,
          });
        },
      toggleCallout:
        (options?: { variant?: Variant; icon?: string }) =>
        ({ commands }: CommandProps) => {
          return commands.toggleWrap(this.name, {
            variant: options?.variant ?? "info",
            icon: options?.icon ?? CALLOUT_VARIANTS[options?.variant ?? "info"].icon,
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-c": () => (this.editor as unknown as { commands: { toggleCallout: () => boolean } }).commands.toggleCallout(),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent);
  },
});
