import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    slashCommand: {
      insertSlashCommand: (command: string) => ReturnType;
    };
  }
}

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addCommands() {
    return {
      insertSlashCommand:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_command: string) =>
        ({ commands }) => {
          return commands.insertContent("/");
        },
    };
  },
});
