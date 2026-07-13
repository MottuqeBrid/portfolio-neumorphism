"use client";

import { type ReactNode } from "react";

interface ToolbarGroupProps {
  children: ReactNode;
}

export default function ToolbarGroup({ children }: ToolbarGroupProps) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}
