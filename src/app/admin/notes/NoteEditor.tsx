"use client";

import { useEffect, useRef } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";

type Props = {
  holderId: string;
  data?: string;
  onReady: (editor: EditorJS) => void;
};

export default function NoteEditor({ holderId, data, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // True once this effect run has been cleaned up (see StrictMode note below),
    // so the throwaway instance's async onReady doesn't clobber the live editor.
    let destroyed = false;

    // Give this instance its own holder node instead of sharing one by id.
    // React can mount/unmount effects twice (StrictMode dev double-invoke),
    // which spins up two editors; a per-instance holder means destroying the
    // throwaway one never wipes the DOM of the one that survives.
    const holder = document.createElement("div");
    container.appendChild(holder);

    let parsedData: OutputData | undefined;
    if (data) {
      try {
        parsedData = JSON.parse(data) as OutputData;
      } catch {
        parsedData = {
          blocks: [{ type: "paragraph", data: { text: data } }],
        };
      }
    }

    const editor = new EditorJS({
      holder,
      placeholder: "Start writing your note...",
      data: parsedData,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [1, 2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
        },
        code: CodeTool,
        marker: {
          class: Marker,
          inlineToolbar: true,
        },
        delimiter: Delimiter,
        inlineCode: {
          class: InlineCode,
          inlineToolbar: true,
        },
      },
      onReady: () => {
        if (destroyed) return;
        editorRef.current = editor;
        onReady(editor);
      },
    });

    return () => {
      destroyed = true;
      editorRef.current = null;
      editor.isReady
        .then(() => {
          editor.destroy();
          holder.remove();
        })
        .catch(() => {
          holder.remove();
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} id={holderId} className="prose-editor" />;
}
