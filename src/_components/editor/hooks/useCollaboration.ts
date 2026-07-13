import { useCallback, useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";

export interface CollabUser {
  clientId: number;
  name: string;
  color: string;
  [key: string]: unknown;
}

export interface CollaborationState {
  isConnected: boolean;
  users: CollabUser[];
  documentName: string | null;
}

export function useCollaboration(
  editor: Editor | null,
  options: {
    documentName?: string;
    providerUrl?: string;
    enabled?: boolean;
  } = {},
) {
  const { documentName, providerUrl, enabled = false } = options;
  const [state, setState] = useState<CollaborationState>({
    isConnected: false,
    users: [],
    documentName: documentName ?? null,
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !editor || !providerUrl || !documentName) return;

    // Collaboration setup will be performed when a provider is connected.
    // The architecture is ready for Hocuspocus/Yjs integration.
    // For now, this hook provides the state interface.

    const connect = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { Doc } = await import("yjs");

        new Doc();

        if (mountedRef.current) {
          setState((prev) => ({
            ...prev,
            isConnected: true,
            documentName,
          }));
        }
      } catch {
        if (mountedRef.current) {
          setState((prev) => ({ ...prev, isConnected: false }));
        }
      }
    };

    void connect();

    return () => {
      if (mountedRef.current) {
        setState((prev) => ({ ...prev, isConnected: false, users: [] }));
      }
    };
  }, [editor, documentName, providerUrl, enabled]);

  const updateUser = useCallback(
    (user: Partial<CollabUser>) => {
      if (!editor || !enabled) return;
      void user;
      try {
        editor.chain().focus().run();
      } catch {
        // Collaboration cursor not available
      }
    },
    [editor, enabled],
  );

  return {
    ...state,
    updateUser,
  };
}
