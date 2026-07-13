import type { JSONContent } from "@tiptap/core";

function renderInlineText(node: JSONContent): string {
  if (node.type === "text") {
    let text = node.text ?? "";
    if (node.marks) {
      for (const mark of node.marks) {
        text = applyMarkdownMark(text, mark);
      }
    }
    return text;
  }
  if (node.type === "hardBreak") return "  \n";
  if (node.type === "mention") {
    return `@${String(node.attrs?.label ?? node.attrs?.id ?? "")}`;
  }
  if (node.type === "hashtag") {
    return `#${String(node.attrs?.tag ?? "")}`;
  }
  if (node.content) {
    return node.content.map(renderInlineText).join("");
  }
  return "";
}

function applyMarkdownMark(text: string, mark: NonNullable<JSONContent["marks"]>[number]): string {
  switch (mark.type) {
    case "bold":
      return `**${text}**`;
    case "italic":
      return `*${text}*`;
    case "strike":
      return `~~${text}~~`;
    case "code":
      return `\`${text}\``;
    case "link": {
      const href = String(mark.attrs?.href ?? "");
      return `[${text}](${href})`;
    }
    default:
      return text;
  }
}

function renderNode(node: JSONContent, indent = 0, orderedIndex?: number): string {
  if (!node.type) return "";
  const pad = "  ".repeat(indent);

  switch (node.type) {
    case "doc":
      return (node.content ?? []).map((n) => renderNode(n, indent)).join("\n\n");

    case "paragraph":
      return `${pad}${(node.content ?? []).map(renderInlineText).join("")}`;

    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const prefix = "#".repeat(level);
      return `${pad}${prefix} ${(node.content ?? []).map(renderInlineText).join("")}`;
    }

    case "bulletList":
      return (node.content ?? []).map((n) => renderNode(n, indent)).join("\n");

    case "orderedList":
      return (node.content ?? []).map((n, i) => renderNode(n, indent, i + 1)).join("\n");

    case "listItem": {
      const bullet = orderedIndex != null ? `${orderedIndex}. ` : "- ";
      const items = node.content ?? [];
      if (items.length === 0) return `${pad}${bullet}`;
      const first = renderNode(items[0], indent);
      const rest = items.slice(1).map((n) => renderNode(n, indent + 1)).join("\n");
      const result = `${pad}${bullet}${first.replace(new RegExp(`^${pad}`), "")}`;
      return rest ? `${result}\n${rest}` : result;
    }

    case "taskList":
      return (node.content ?? []).map((n) => renderNode(n, indent)).join("\n");

    case "taskItem": {
      const checked = node.attrs?.checked ? "x" : " ";
      const content = (node.content ?? []).map(renderInlineText).join("");
      return `${pad}- [${checked}] ${content}`;
    }

    case "blockquote": {
      const inner = (node.content ?? []).map((n) => renderNode(n, indent)).join("\n");
      return inner.split("\n").map((line) => `> ${line}`).join("\n");
    }

    case "codeBlock": {
      const lang = node.attrs?.language ?? "";
      const text = node.content?.[0]?.text ?? "";
      return `${pad}\`\`\`${lang}\n${text}\n${pad}\`\`\``;
    }

    case "horizontalRule":
      return `${pad}---`;

    case "hardBreak":
      return "  \n";

    case "image": {
      const src = String(node.attrs?.src ?? "");
      const alt = String(node.attrs?.alt ?? "");
      return `${pad}![${alt}](${src})`;
    }

    case "table": {
      const rows = node.content ?? [];
      if (rows.length === 0) return "";
      const result: string[] = [];
      rows.forEach((row, i) => {
        const cells = (row.content ?? []).map((cell) => {
          return (cell.content ?? []).map(renderInlineText).join("");
        });
        result.push(`| ${cells.join(" | ")} |`);
        if (i === 0) {
          result.push(`| ${cells.map(() => "---").join(" | ")} |`);
        }
      });
      return result.join("\n");
    }

    case "callout": {
      const icon = String(node.attrs?.icon ?? "💡");
      const inner = (node.content ?? []).map((n) => renderNode(n, indent)).join("\n");
      return `${pad}> ${icon} ${inner}`;
    }

    case "math":
    case "mathematica": {
      const formula = String(node.attrs?.formula ?? "");
      if (node.attrs?.display) {
        return `${pad}$$\n${formula}\n$$`;
      }
      return `$${formula}$`;
    }

    case "videoEmbed": {
      const src = String(node.attrs?.src ?? "");
      return `${pad}[Video](${src})`;
    }

    case "youtube": {
      const src = String(node.attrs?.src ?? "");
      return `${pad}[YouTube](${src})`;
    }

    default:
      if (node.content) {
        return node.content.map((n) => renderNode(n, indent)).join("\n");
      }
      return "";
  }
}

export function tiptapToMarkdown(json: JSONContent | string): string {
  const content = typeof json === "string" ? (JSON.parse(json) as JSONContent) : json;
  return renderNode(content);
}
