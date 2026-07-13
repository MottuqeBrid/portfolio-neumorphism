"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Doc } from "yjs";

interface CollaborationContextValue {
  doc: Doc | null;
  isConnected: boolean;
  documentName: string | null;
}

const CollaborationContext = createContext<CollaborationContextValue>({
  doc: null,
  isConnected: false,
  documentName: null,
});

export function useCollaborationContext() {
  return useContext(CollaborationContext);
}

interface CollaborationProviderProps {
  children: ReactNode;
  documentName: string;
  providerUrl?: string;
}

export default function CollaborationProvider({
  children,
  documentName,
  providerUrl,
}: CollaborationProviderProps) {
  const [state, setState] = useState<CollaborationContextValue>({
    doc: null,
    isConnected: false,
    documentName,
  });

  useEffect(() => {
    let doc: Doc | null = null;

    const connect = async () => {
      try {
        const { Doc } = await import("yjs");
        doc = new Doc();

        setState({
          doc,
          isConnected: true,
          documentName,
        });

        // When a Hocuspocus provider is configured, connect:
        // const { HocuspocusProvider } = await import("@hocuspocus/provider");
        // const provider = new HocuspocusProvider({
        //   url: providerUrl!,
        //   name: documentName,
        //   document: doc,
        // });
        //
        // provider.on("synced", () => {
        //   setState(prev => ({ ...prev, isConnected: true }));
        // });
      } catch {
        setState((prev) => ({ ...prev, isConnected: false }));
      }
    };

    void connect();

    return () => {
      if (doc) {
        doc.destroy();
      }
    };
  }, [documentName, providerUrl]);

  return (
    <CollaborationContext.Provider value={state}>
      {children}
    </CollaborationContext.Provider>
  );
}
