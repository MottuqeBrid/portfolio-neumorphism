import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

function MentionComponent(props: NodeViewProps) {
  const { node } = props;
  const label = String(node.attrs.label ?? node.attrs.id ?? "");

  return (
    <NodeViewWrapper as="span" className="mention inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-sm font-semibold text-sky-700">
      @{label}
    </NodeViewWrapper>
  );
}

export interface MentionOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mention: {
      insertMention: (options: { id: string; label?: string }) => ReturnType;
    };
  }
}

export const Mention = Node.create<MentionOptions>({
  name: "mention",

  group: "inline",

  inline: true,

  selectable: false,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="mention"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            id: element.getAttribute("data-id"),
            label: element.getAttribute("data-label"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "mention",
        "data-id": HTMLAttributes.id,
        "data-label": HTMLAttributes.label,
        class: "mention",
      }),
      `@${HTMLAttributes.label ?? HTMLAttributes.id}`,
    ];
  },

  addCommands() {
    return {
      insertMention:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              id: options.id,
              label: options.label ?? options.id,
            },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MentionComponent);
  },
});
