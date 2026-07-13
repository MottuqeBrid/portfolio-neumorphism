import { mergeAttributes, Node } from "@tiptap/core";

export interface VideoEmbedOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (options: { src: string; caption?: string }) => ReturnType;
      toggleVideoEmbed: (options: { src: string; caption?: string }) => ReturnType;
      updateVideoEmbed: (options: { src?: string; caption?: string }) => ReturnType;
    };
  }
}

export const VideoEmbed = Node.create<VideoEmbedOptions>({
  name: "videoEmbed",

  group: "block",

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      caption: { default: null },
      width: { default: "100%" },
      height: { default: "auto" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video[src]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            src: element.getAttribute("src"),
          };
        },
      },
      {
        tag: 'div[data-type="video-embed"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            src: element.getAttribute("data-src"),
            caption: element.getAttribute("data-caption"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "video-embed",
        class: "video-embed",
      }),
      [
        "video",
        mergeAttributes(HTMLAttributes, {
          controls: "true",
          class: "w-full rounded-xl",
        }),
      ],
      HTMLAttributes.caption
        ? ["figcaption", String(HTMLAttributes.caption)]
        : [],
    ];
  },

  addCommands() {
    return {
      setVideoEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src: options.src, caption: options.caption ?? "" },
          });
        },

      toggleVideoEmbed:
        (options) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph", {
            src: options.src,
            caption: options.caption ?? "",
          });
        },

      updateVideoEmbed:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        },
    };
  },
});
