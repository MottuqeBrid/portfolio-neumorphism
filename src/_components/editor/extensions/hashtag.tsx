import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

function HashtagComponent(props: NodeViewProps) {
  const { node } = props;
  const tag = String(node.attrs.tag ?? "");

  return (
    <NodeViewWrapper as="span" className="hashtag inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-sm font-semibold text-violet-700">
      #{tag}
    </NodeViewWrapper>
  );
}

export interface HashtagOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    hashtag: {
      insertHashtag: (options: { tag: string }) => ReturnType;
    };
  }
}

export const Hashtag = Node.create<HashtagOptions>({
  name: "hashtag",

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
      tag: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="hashtag"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            tag: element.getAttribute("data-tag"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "hashtag",
        "data-tag": HTMLAttributes.tag,
        class: "hashtag",
      }),
      `#${HTMLAttributes.tag}`,
    ];
  },

  addCommands() {
    return {
      insertHashtag:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { tag: options.tag },
          });
        },
    };
  },

  addInputRules() {
    return [];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HashtagComponent);
  },
});
