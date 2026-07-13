import { mergeAttributes, Node } from "@tiptap/core";

export interface MathOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    math: {
      setMath: (options: { formula: string; display?: boolean }) => ReturnType;
      insertMath: (options: { formula: string; display?: boolean }) => ReturnType;
      updateMath: (options: { formula: string }) => ReturnType;
    };
  }
}

export const Mathematics = Node.create<MathOptions>({
  name: "math",

  group: "inline",

  inline: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      formula: { default: "" },
      display: { default: false },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            formula: element.getAttribute("data-formula") || "",
            display: element.getAttribute("data-display") === "true",
          };
        },
      },
      {
        tag: 'div[data-type="math"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            formula: element.getAttribute("data-formula") || "",
            display: element.getAttribute("data-display") === "true",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const display = HTMLAttributes.display;
    if (display) {
      return [
        "div",
        mergeAttributes(this.options.HTMLAttributes, {
          "data-type": "math",
          "data-formula": HTMLAttributes.formula,
          "data-display": "true",
          class: "math-display",
        }),
        String(HTMLAttributes.formula),
      ];
    }
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "math",
        "data-formula": HTMLAttributes.formula,
        class: "math-inline",
      }),
      String(HTMLAttributes.formula),
    ];
  },

  addCommands() {
    return {
      setMath:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              formula: options.formula,
              display: options.display ?? false,
            },
          });
        },

      insertMath:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              formula: options.formula,
              display: options.display ?? false,
            },
          });
        },

      updateMath:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        },
    };
  },

  addInputRules() {
    return [];
  },
});
