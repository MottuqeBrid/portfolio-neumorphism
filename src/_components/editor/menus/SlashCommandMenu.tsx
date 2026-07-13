"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SlashCommandItem {
  title: string;
  description: string;
  icon: string;
  category: string;
  command: (args: { editor: { chain: () => { focus: () => { run: () => unknown } }; commands: Record<string, (...args: unknown[]) => unknown> }; range: unknown }) => void;
}

interface SlashCommandMenuProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export default function SlashCommandMenu({ items, command }: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef(command);

  useEffect(() => {
    commandRef.current = command;
  });

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, SlashCommandItem[]>,
  );

  const flatItems = Object.values(groupedItems).flat();

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
      setSelectedIndex((prev) => (prev + flatItems.length - 1) % flatItems.length);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        commandRef.current(flatItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
    }
  };

  if (flatItems.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">No results found</p>
      </div>
    );
  }

  let itemIndex = 0;

  return (
    <div
      ref={listRef}
      className="w-72 max-h-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
      onKeyDown={handleKeyDown}
    >
      <div className="border-b border-slate-100 p-2 dark:border-slate-700">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search commands..."
          className="w-full rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
          autoFocus
        />
      </div>

      <div className="overflow-y-auto p-1">
        {Object.entries(groupedItems).map(([category, catItems]) => (
          <div key={category} className="mb-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {category}
            </div>
            {catItems.map((item) => {
              const currentIndex = itemIndex++;
              return (
                <button
                  key={item.title}
                  data-index={currentIndex}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                    currentIndex === selectedIndex
                      ? "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                  }`}
                  onClick={() => command(item)}
                  onMouseEnter={() => setSelectedIndex(currentIndex)}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base dark:bg-slate-700">
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="truncate text-xs text-slate-400 dark:text-slate-500">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export type { SlashCommandItem, SlashCommandMenuProps };
