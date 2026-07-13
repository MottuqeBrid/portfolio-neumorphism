import type { JSONContent } from "@tiptap/core";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderNode(node: JSONContent): string {
  if (!node.type) return "";

  switch (node.type) {
    case "doc":
      return (node.content ?? []).map(renderNode).join("\n");

    case "paragraph":
      return `<p>${renderInline(node)}</p>`;

    case "heading": {
      const level = node.attrs?.level ?? 2;
      return `<h${level}>${renderInline(node)}</h${level}>`;
    }

    case "bulletList":
      return `<ul>${(node.content ?? []).map(renderNode).join("")}</ul>`;

    case "orderedList":
      return `<ol>${(node.content ?? []).map(renderNode).join("")}</ol>`;

    case "listItem":
      return `<li>${(node.content ?? []).map(renderNode).join("")}</li>`;

    case "taskList":
      return `<ul class="prose-checklist">${(node.content ?? []).map(renderNode).join("")}</ul>`;

    case "taskItem": {
      const checked = node.attrs?.checked ? "checked" : "";
      const nested = (node.content ?? []).map(renderNode).join("");
      return `<li class="checklist-item"><input type="checkbox" disabled ${checked} /><span>${nested}</span></li>`;
    }

    case "blockquote":
      return `<blockquote>${(node.content ?? []).map(renderNode).join("")}</blockquote>`;

    case "codeBlock": {
      const lang = node.attrs?.language ? ` class="language-${String(node.attrs.language)}"` : "";
      const text = node.content?.[0]?.text ?? "";
      return `<pre><code${lang}>${escapeHtml(text)}</code></pre>`;
    }

    case "horizontalRule":
      return "<hr />";

    case "hardBreak":
      return "<br />";

    case "image": {
      const src = String(node.attrs?.src ?? "");
      const alt = String(node.attrs?.alt ?? "");
      const title = node.attrs?.title ? ` title="${String(node.attrs.title)}"` : "";
      const width = node.attrs?.width ? ` width="${node.attrs.width}"` : "";
      const height = node.attrs?.height ? ` height="${node.attrs.height}"` : "";
      if (!src) return "";
      return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${title}${width}${height} />${alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : ""}</figure>`;
    }

    case "youtube": {
      const url = String(node.attrs?.src ?? "");
      if (!url) return "";
      return `<div class="embed-placeholder" data-type="youtube" data-src="${escapeHtml(url)}"><iframe src="${escapeHtml(url)}" frameborder="0" allowfullscreen></iframe></div>`;
    }

    case "table":
      return `<table>${(node.content ?? []).map(renderNode).join("")}</table>`;

    case "tableRow":
      return `<tr>${(node.content ?? []).map(renderNode).join("")}</tr>`;

    case "tableCell":
      return `<td>${(node.content ?? []).map(renderNode).join("")}</td>`;

    case "tableHeader":
      return `<th>${(node.content ?? []).map(renderNode).join("")}</th>`;

    case "callout": {
      const variant = String(node.attrs?.variant ?? "info");
      const icon = String(node.attrs?.icon ?? "💡");
      return `<div class="callout callout-${variant}" data-variant="${variant}"><span class="callout-icon">${icon}</span><div class="callout-content">${(node.content ?? []).map(renderNode).join("")}</div></div>`;
    }

    case "toggleList": {
      const open = node.attrs?.open ? " open" : "";
      return `<details${open}><summary>${renderInline(node)}</summary>${(node.content ?? []).map(renderNode).join("")}</details>`;
    }

    case "mathematica":
    case "math": {
      const formula = String(node.attrs?.formula ?? "");
      const display = node.attrs?.display;
      if (display) {
        return `<div class="math-display" data-formula="${escapeHtml(formula)}">\\[${escapeHtml(formula)}\\]</div>`;
      }
      return `<span class="math-inline" data-formula="${escapeHtml(formula)}">\\(${escapeHtml(formula)}\\)</span>`;
    }

    case "videoEmbed": {
      const src = String(node.attrs?.src ?? "");
      const caption = node.attrs?.caption ? String(node.attrs.caption) : "";
      if (!src) return "";
      return `<figure><video src="${escapeHtml(src)}" controls></video>${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
    }

    case "mention": {
      const id = String(node.attrs?.id ?? "");
      const label = String(node.attrs?.label ?? id);
      return `<span class="mention" data-id="${escapeHtml(id)}">@${escapeHtml(label)}</span>`;
    }

    case "hashtag": {
      const tag = String(node.attrs?.tag ?? "");
      return `<span class="hashtag" data-tag="${escapeHtml(tag)}">#${escapeHtml(tag)}</span>`;
    }

    case "text":
      return escapeHtml(node.text ?? "");

    default:
      if (node.content) {
        return node.content.map(renderNode).join("");
      }
      return "";
  }
}

function renderInline(node: JSONContent): string {
  if (!node.content) return "";
  return node.content.map(renderInlineNode).join("");
}

function renderInlineNode(node: JSONContent): string {
  if (node.type === "text") {
    let text = escapeHtml(node.text ?? "");
    if (node.marks) {
      for (const mark of node.marks) {
        text = applyMark(text, mark);
      }
    }
    return text;
  }

  if (node.type === "hardBreak") return "<br />";
  if (node.type === "mention") {
    const id = String(node.attrs?.id ?? "");
    const label = String(node.attrs?.label ?? id);
    return `<span class="mention" data-id="${escapeHtml(id)}">@${escapeHtml(label)}</span>`;
  }
  if (node.type === "hashtag") {
    const tag = String(node.attrs?.tag ?? "");
    return `<span class="hashtag" data-tag="${escapeHtml(tag)}">#${escapeHtml(tag)}</span>`;
  }

  return renderNode(node);
}

function applyMark(text: string, mark: NonNullable<JSONContent["marks"]>[number]): string {
  switch (mark.type) {
    case "bold":
      return `<strong>${text}</strong>`;
    case "italic":
      return `<em>${text}</em>`;
    case "strike":
      return `<s>${text}</s>`;
    case "underline":
      return `<u>${text}</u>`;
    case "code":
      return `<code>${text}</code>`;
    case "highlight": {
      const color = mark.attrs?.color;
      const bgColor = mark.attrs?.backgroundColor;
      const style = [color ? `color:${color}` : "", bgColor ? `background-color:${bgColor}` : ""]
        .filter(Boolean)
        .join(";");
      return style ? `<mark style="${escapeHtml(style)}">${text}</mark>` : `<mark>${text}</mark>`;
    }
    case "textStyle": {
      const color = mark.attrs?.color;
      const fontSize = mark.attrs?.fontSize;
      const fontFamily = mark.attrs?.fontFamily;
      const style = [
        color ? `color:${color}` : "",
        fontSize ? `font-size:${fontSize}` : "",
        fontFamily ? `font-family:${fontFamily}` : "",
      ]
        .filter(Boolean)
        .join(";");
      return style ? `<span style="${escapeHtml(style)}">${text}</span>` : text;
    }
    case "link": {
      const href = String(mark.attrs?.href ?? "#");
      const target = mark.attrs?.target ? ` target="${String(mark.attrs.target)}"` : "";
      return `<a href="${escapeHtml(href)}"${target}>${text}</a>`;
    }
    case "subscript":
      return `<sub>${text}</sub>`;
    case "superscript":
      return `<sup>${text}</sup>`;
    default:
      return text;
  }
}

export function tiptapToHtml(json: JSONContent | string): string {
  const content = typeof json === "string" ? (JSON.parse(json) as JSONContent) : json;
  return renderNode(content);
}
