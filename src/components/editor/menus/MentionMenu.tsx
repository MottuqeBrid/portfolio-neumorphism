"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface MentionUser {
  id: string;
  name: string;
  avatar?: string;
}

interface MentionMenuProps {
  users: MentionUser[];
  command: (user: MentionUser) => void;
}

export default function MentionMenu({ users, command }: MentionMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef(command);

  useEffect(() => {
    commandRef.current = command;
  });

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + filtered.length - 1) % filtered.length);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        commandRef.current(filtered[selectedIndex]);
      }
    }
  };

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500">No users found</p>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="w-64 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
      onKeyDown={handleKeyDown}
    >
      <div className="border-b border-slate-100 p-2 dark:border-slate-700">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:bg-slate-700 dark:text-slate-200"
          autoFocus
        />
      </div>

      {filtered.map((user, i) => (
        <button
          key={user.id}
          data-index={i}
          type="button"
          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
            i === selectedIndex
              ? "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
              : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
          }`}
          onClick={() => command(user)}
          onMouseEnter={() => setSelectedIndex(i)}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <span className="font-medium">{user.name}</span>
        </button>
      ))}
    </div>
  );
}

export type { MentionUser, MentionMenuProps };
