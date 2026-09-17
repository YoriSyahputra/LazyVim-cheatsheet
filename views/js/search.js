/**
 * Smart Search Engine: Multi-Field Fuzzy Matching & Substring Highlighter
 */
import { getItemAction, getItemDesc, getCategoryI18n } from "./i18n.js";

export function searchKeymaps(query, keymaps) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return null;

  const terms = trimmed.split(/\s+/).filter(Boolean);

  return keymaps.filter((item) => {
    const actionText = getItemAction(item).toLowerCase();
    const descText = getItemDesc(item).toLowerCase();
    const rawKeys = item.rawKeys.toLowerCase();
    const mode = item.mode.toLowerCase();
    const catInfo = getCategoryI18n(item.cat);
    const catTitle = (catInfo ? catInfo.title : "").toLowerCase();

    return terms.every((term) => {
      return (
        actionText.includes(term) ||
        descText.includes(term) ||
        rawKeys.includes(term) ||
        mode.includes(term) ||
        catTitle.includes(term)
      );
    });
  });
}

export function highlightText(text, query) {
  if (!query || !text) return escapeHtml(text);

  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (terms.length === 0) return escapeHtml(text);

  const regex = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts
    .map((part) => {
      if (regex.test(part)) {
        return `<mark class="hl">${escapeHtml(part)}</mark>`;
      }
      return escapeHtml(part);
    })
    .join("");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
