import { FiGithub } from "react-icons/fi";

export function LinkChip({
  href,
  label,
  icon: Icon,
}: {
  href?: string;
  label: string;
  icon: typeof FiGithub;
}) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="nm-protrude-sm inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:text-sky-700 active:nm-pressed"
    >
      <Icon size={13} aria-hidden="true" />
      {label}
    </a>
  );
}
