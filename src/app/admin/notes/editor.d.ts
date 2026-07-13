declare module "@editorjs/marker" {
  import type { InlineToolConstructable } from "@editorjs/editorjs";
  const Marker: InlineToolConstructable;
  export default Marker;
}

declare module "@editorjs/delimiter" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Delimiter: BlockToolConstructable;
  export default Delimiter;
}

declare module "@editorjs/inline-code" {
  import type { InlineToolConstructable } from "@editorjs/editorjs";
  const InlineCode: InlineToolConstructable;
  export default InlineCode;
}

declare module "@editorjs/code" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const CodeTool: BlockToolConstructable;
  export default CodeTool;
}

declare module "@editorjs/quote" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Quote: BlockToolConstructable;
  export default Quote;
}

declare module "@editorjs/list" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const List: BlockToolConstructable;
  export default List;
}

declare module "@editorjs/header" {
  import type { BlockToolConstructable } from "@editorjs/editorjs";
  const Header: BlockToolConstructable;
  export default Header;
}
