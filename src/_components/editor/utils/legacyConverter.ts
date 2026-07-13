type BlockData = Record<string, unknown>;

type EditorBlock = {
  type: string;
  data: BlockData;
};

type EditorJSOutput = {
  blocks: EditorBlock[];
};

type ListItem = {
  content?: string;
  text?: string;
  checked?: boolean;
  items?: ListItem[];
  meta?: { checked?: boolean };
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderList(
  items: unknown,
  tag: "ol" | "ul",
  checklist: boolean,
): string {
  if (!Array.isArray(items) || items.length === 0) return "";

  const lis = items
    .map((item) => {
      if (item && typeof item === "object") {
        const li = item as ListItem;
        const content = li.content ?? li.text ?? "";
        const nested =
          Array.isArray(li.items) && li.items.length
            ? renderList(li.items, tag, checklist)
            : "";
        if (checklist) {
          const checked = li.meta?.checked ?? li.checked ? "checked" : "";
          return `<li class="checklist-item"><input type="checkbox" disabled ${checked} /><span>${content}</span>${nested}</li>`;
        }
        return `<li>${content}${nested}</li>`;
      }
      return `<li>${String(item)}</li>`;
    })
    .join("");

  if (checklist) return `<ul class="prose-checklist">${lis}</ul>`;
  return `<${tag}>${lis}</${tag}>`;
}

function renderBlock(block: EditorBlock): string {
  const d = block.data;

  switch (block.type) {
    case "header": {
      const level = Number(d.level) || 2;
      return `<h${level}>${String(d.text ?? "")}</h${level}>`;
    }

    case "paragraph":
      return `<p>${String(d.text ?? "")}</p>`;

    case "list": {
      const style = String(d.style ?? "unordered");
      if (style === "checklist") return renderList(d.items, "ul", true);
      const tag = style === "ordered" ? "ol" : "ul";
      return renderList(d.items, tag, false);
    }

    case "checklist":
      return renderList(d.items, "ul", true);

    case "quote": {
      const caption = d.caption
        ? `<footer>— ${String(d.caption)}</footer>`
        : "";
      return `<blockquote><p>${String(d.text ?? "")}</p>${caption}</blockquote>`;
    }

    case "code":
      return `<pre><code>${escapeHtml(String(d.code ?? ""))}</code></pre>`;

    case "delimiter":
      return "<hr />";

    case "image": {
      const file = d.file as { url?: string } | undefined;
      const url = String(file?.url ?? d.url ?? "");
      const caption = d.caption ? String(d.caption) : "";
      if (!url) return "";
      return `<figure><img src="${escapeHtml(url)}" alt="${escapeHtml(caption)}" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
    }

    default:
      return "";
  }
}

export function legacyEditorJsToHtml(data: EditorJSOutput): string {
  if (!data?.blocks?.length) return "";
  return data.blocks.map(renderBlock).join("\n");
}

export function isLegacyEditorJsData(json: unknown): boolean {
  if (!json || typeof json !== "object") return false;
  const obj = json as Record<string, unknown>;
  return "blocks" in obj && Array.isArray(obj.blocks);
}
