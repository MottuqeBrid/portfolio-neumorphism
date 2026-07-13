import { mergeAttributes, Node, type CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/react";

function ToggleListComponent(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props;
  const open = node.attrs.open as boolean;

  return (
    <NodeViewWrapper data-drag-handle>
      <div
        className={`my-1 rounded-xl border border-slate-200 ${
          selected ? "ring-2 ring-sky-400" : ""
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            type="button"
            contentEditable={false}
            className="shrink-0 text-slate-400 transition-transform hover:text-slate-600"
            onClick={() => updateAttributes({ open: !open })}
          >
            <svg
              className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="text-sm font-bold text-slate-700">Toggle</span>
        </div>
        {open && (
          <div className="border-t border-slate-200 px-6 py-3">
            <NodeViewContent className="min-h-[1em] text-sm text-slate-700" />
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const ToggleList = Node.create({
  name: "toggleList",

  group: "block",

  content: "block+",

  defining: true,

  draggable: true,

  addAttributes() {
    return {
      open: { default: false },
      label: { default: "Toggle" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="toggle-list"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            open: element.getAttribute("data-open") === "true",
            label: element.getAttribute("data-label") || "Toggle",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "toggle-list",
        class: "toggle-list",
      }),
      0,
    ];
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCommands(): any {
    return {
      setToggleList:
        () =>
        ({ commands }: CommandProps) => {
          return commands.wrapIn(this.name);
        },
      toggleToggleList:
        () =>
        ({ commands }: CommandProps) => {
          return commands.toggleWrap(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-t": () => (this.editor as unknown as { commands: { toggleToggleList: () => boolean } }).commands.toggleToggleList(),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ToggleListComponent);
  },
});
