import {
  mergeAttributes,
  Node,
  type CommandProps,
} from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import {
  useCallback,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { uploadImage } from "../utils/uploadHandler";

function ImageUploadComponent(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props;
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) ?? "";
  const caption = (node.attrs.caption as string) ?? "";
  const width = node.attrs.width as number | null;

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are supported.");
        return;
      }
      setIsUploading(true);
      setError("");
      try {
        const url = await uploadImage(file);
        updateAttributes({ src: url, alt: file.name });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [updateAttributes],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  if (!src) {
    return (
      <NodeViewWrapper
        data-drag-handle
        onDragOver={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div
          className={`my-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-sky-400 bg-sky-50"
              : "border-slate-300 bg-slate-50 hover:border-sky-300"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <span className="text-sm text-slate-500">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-slate-600">Click to upload or drag & drop</span>
              <span className="text-xs text-slate-400">PNG, JPG, GIF, WebP</span>
            </div>
          )}
          {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper data-drag-handle>
      <figure
        className={`my-2 rounded-xl overflow-hidden transition-all ${
          selected ? "ring-2 ring-sky-400" : ""
        }`}
        contentEditable={false}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full rounded-xl"
          style={width ? { maxWidth: `${width}%` } : undefined}
          draggable={false}
        />
        {(caption || selected) && (
          <input
            type="text"
            value={caption}
            placeholder="Add a caption..."
            className="w-full bg-transparent px-3 py-2 text-center text-xs text-slate-500 outline-none placeholder:text-slate-300"
            onChange={(e) => updateAttributes({ caption: e.target.value })}
          />
        )}
      </figure>
    </NodeViewWrapper>
  );
}

export const ImageUpload = Node.create({
  name: "imageUpload",

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  group: "block",

  draggable: true,

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      caption: { default: null },
      width: { default: null },
      height: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            src: element.getAttribute("src"),
            alt: element.getAttribute("alt"),
            title: element.getAttribute("title"),
            width: element.getAttribute("width"),
            height: element.getAttribute("height"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ["img"],
    ];
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCommands(): any {
    return {
      setImageUpload:
        (options?: { src?: string }) =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({
            type: this.name,
            attrs: options?.src ? { src: options.src } : {},
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadComponent);
  },
});
