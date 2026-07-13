"use client";

import { useCallback, useMemo, useRef, useState } from "react";

const EMOJI_CATEGORIES: Record<string, string[]> = {
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🫢", "🫣", "🤫", "🤔", "🫡", "🤐", "🤨", "😐", "😑", "😶", "🫥", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐"],
  "Gestures": ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "🫵", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"],
  "Objects": ["💻", "🖥️", "📱", "📲", "⌨️", "🖨️", "🖱️", "💾", "💿", "📀", "📷", "📸", "📹", "🎥", "📽️", "🎬", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏰", "📡", "🔋", "🪫", "🔌", "💡", "🔦", "🕯️"],
  "Symbols": ["✅", "❌", "⭕", "❗", "❓", "‼️", "⁉️", "💯", "🔥", "⭐", "🌟", "💫", "✨", "⚡", "🎉", "🎊", "🏆", "🎯", "🚀", "💡"],
};

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Smileys");
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredEmojis = useMemo(() => {
    if (!search) return EMOJI_CATEGORIES[activeCategory] ?? [];
    return Object.values(EMOJI_CATEGORIES)
      .flat()
      .filter((_, i) => i < 200);
  }, [search, activeCategory]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [],
  );

  return (
    <div className="w-72 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-100 p-2 dark:border-slate-700">
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search emoji..."
          className="w-full rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:bg-slate-700 dark:text-slate-200"
          autoFocus
        />
      </div>

      <div className="flex border-b border-slate-100 px-1 dark:border-slate-700">
        {Object.keys(EMOJI_CATEGORIES).map((cat) => (
          <button
            key={cat}
            type="button"
            className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            onClick={() => {
              setActiveCategory(cat);
              setSearch("");
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid max-h-48 grid-cols-8 gap-0.5 overflow-y-auto p-2">
        {filteredEmojis.map((emoji, i) => (
          <button
            key={`${emoji}-${i}`}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export { EMOJI_CATEGORIES };
